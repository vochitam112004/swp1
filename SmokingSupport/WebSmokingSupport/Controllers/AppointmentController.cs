using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Security.Claims;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<Appointment> _appointmentRepository;

        public AppointmentController(QuitSmokingSupportContext context, IGenericRepository<Appointment> appointmentRepository)
        {
            _context = context;
            _appointmentRepository = appointmentRepository;
        }


        [HttpPost("Coach/CreateWeekSlots")]
        [Authorize(Roles = "Coach")]
        public async Task<ActionResult<IEnumerable<DTOCoachSlotCreated>>> CreateWeekSlots([FromBody] DTOCoachWeekSlotsCreate dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var coachProfile = await _context.CoachProfiles.FirstOrDefaultAsync(c => c.UserId == userId);
            if (coachProfile == null)
                return Unauthorized("Coach profile not found.");

            var createdSlots = new List<Appointment>();

            foreach (var slotDto in dto.Availabilities)
            {
                
                if (slotDto.AppointmentDate < DateOnly.FromDateTime(DateTime.UtcNow))
                    return BadRequest($"Appointment date {slotDto.AppointmentDate} cannot be in the past.");

                
                if (slotDto.EndTime <= slotDto.StartTime)
                    return BadRequest($"End time must be later than start time for date {slotDto.AppointmentDate}.");

                
                bool isOverlap = await _context.Appointments.AnyAsync(a =>
                    a.CoachId == coachProfile.CoachId &&
                    a.AppointmentDate == slotDto.AppointmentDate &&
                    ((slotDto.StartTime >= a.StartTime && slotDto.StartTime < a.EndTime) ||
                     (slotDto.EndTime > a.StartTime && slotDto.EndTime <= a.EndTime))
                );

                if (isOverlap)
                    return BadRequest($"Slot overlaps with an existing one on {slotDto.AppointmentDate}.");

                // Tạo slot mới
                var appointment = new Appointment
                {
                    CoachId = coachProfile.CoachId,
                    AppointmentDate = slotDto.AppointmentDate,
                    StartTime = slotDto.StartTime,
                    EndTime = slotDto.EndTime,
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(appointment);
                createdSlots.Add(appointment);
            }

            await _context.SaveChangesAsync();

            // Trả về list slot đã tạo
            var response = createdSlots.Select(s => new DTOCoachSlotCreated
            {
                AppointmentId = s.AppointmentId,
                CoachId = s.CoachId.Value,
                AppointmentDate = s.AppointmentDate,
                StartTime = s.StartTime,
                EndTime = s.EndTime ?? TimeOnly.MinValue,
                Status = s.Status
            }).ToList();

            return Ok(response);
        }



        [HttpGet("Coach/MySlots")]
        [Authorize(Roles = "Coach")]
        public async Task<ActionResult<IEnumerable<DTOAppointmentForCoachView>>> MySchedule()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var coachProfile = await _context.CoachProfiles.FirstOrDefaultAsync(c => c.UserId == userId);
            if (coachProfile == null) return Unauthorized("Coach profile not found.");

            var slots = await _context.Appointments
                .Include(a => a.Member).ThenInclude(m => m.User)
                .Where(a => a.CoachId == coachProfile.CoachId)
                .Select(a => new DTOAppointmentForCoachView
                {
                    AppointmentId = a.AppointmentId,
                    AppointmentDate = a.AppointmentDate,
                    StartTime = a.StartTime.ToTimeSpan(),
                    EndTime = a.EndTime.HasValue ? a.EndTime.Value.ToTimeSpan() : TimeSpan.Zero,
                    Status = a.Status,
                    MemberName = a.Member != null ? a.Member.User.DisplayName : null
                })
                .ToListAsync();

            return Ok(slots);
        }

        [HttpPut("Coach/UpdateSlot/{appointmentId}")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> UpdateAvailability(int appointmentId, [FromBody] DTOAppointmentForUpdate dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var coachProfile = await _context.CoachProfiles.FirstOrDefaultAsync(c => c.UserId == userId);
            if (coachProfile == null) return Unauthorized("Coach profile not found.");

            var slot = await _context.Appointments.FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && a.CoachId == coachProfile.CoachId);
            if (slot == null) return NotFound("Slot not found.");
            if (slot.Status != "Available") return BadRequest("Cannot update booked slot.");

            if (dto.AppointmentDate.HasValue) slot.AppointmentDate = dto.AppointmentDate.Value;
            if (dto.StartTime.HasValue) slot.StartTime = dto.StartTime.Value;
            if (dto.EndTime.HasValue) slot.EndTime = dto.EndTime.Value;

            slot.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Slot updated successfully.");
        }
        [HttpDelete("Coach/DeleteSlot/{appointmentId}")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> DeleteAvailability(int appointmentId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var coachProfile = await _context.CoachProfiles.FirstOrDefaultAsync(c => c.UserId == userId);
            if (coachProfile == null) return Unauthorized("Coach profile not found.");

            var slot = await _context.Appointments.FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && a.CoachId == coachProfile.CoachId);
            if (slot == null) return NotFound("Slot not found.");
            if (slot.Status != "Available") return BadRequest("Cannot delete booked slot.");

            _context.Appointments.Remove(slot);
            await _context.SaveChangesAsync();
            return Ok("Slot deleted successfully.");
        }
        [HttpGet("Member/CoachSlots/{coachId}")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<IEnumerable<DTOAppointmentForMemberView>>> GetCoachAvailableSlots(int coachId)
        {
            var slots = await _context.Appointments
                .Where(a => a.CoachId == coachId && a.Status == "Available")
                .Select(a => new DTOAppointmentForMemberView
                {
                    AppointmentId = a.AppointmentId,
                    AppointmentDate = a.AppointmentDate,
                    StartTime = a.StartTime.ToTimeSpan(),
                    EndTime = a.EndTime.HasValue ? a.EndTime.Value.ToTimeSpan() : TimeSpan.Zero,
                    Status = a.Status,
                    CoachName = a.Coach.Coach.DisplayName
                })
                .ToListAsync();

            return Ok(slots);
        }
        [HttpPost("Member/Book/{appointmentId}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> BookFromAvailability(int appointmentId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var memberProfile = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
            if (memberProfile == null) return Unauthorized("Member profile not found.");

            var slot = await _context.Appointments.FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && a.Status == "Available");
            if (slot == null) return BadRequest("Slot not available.");

            slot.MemberId = memberProfile.MemberId;
            slot.Status = "Scheduled";
            slot.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok("Appointment booked successfully.");
        }
        [HttpDelete("Member/Cancel/{appointmentId}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var memberProfile = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
            if (memberProfile == null) return Unauthorized("Member profile not found.");

            var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && a.MemberId == memberProfile.MemberId);
            if (appointment == null) return NotFound("Appointment not found.");
            if (appointment.AppointmentDate < DateOnly.FromDateTime(DateTime.UtcNow))
                return BadRequest("Cannot cancel past or ongoing appointments.");

            appointment.Status = "Available";
            appointment.MemberId = null;
            appointment.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok("Appointment cancelled successfully.");
        }
        [HttpGet("MyAppointments")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<IEnumerable<DTOAppointmentForRead>>> GetMyAppointments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            IQueryable<Appointment> query = _context.Appointments
                .Include(a => a.Member).ThenInclude(m => m.User)
                .Include(a => a.Coach).ThenInclude(c => c.Coach);

            if (role == "Member")
                query = query.Where(a => a.Member.UserId == userId);
            else if (role == "Coach")
                query = query.Where(a => a.Coach.UserId == userId);

            var appointments = await query.ToListAsync();
            return Ok(appointments.Select(MapToDTO).ToList());
        }

        [HttpPut("{appointmentId}")]
        [Authorize(Roles = "Member, Coach")]
        [HttpPut("{appointmentId}")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] DTOAppointmentForUpdate dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Member)
                .Include(a => a.Coach)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null)
                return NotFound("Appointment not found.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            
            if (appointment.Member?.UserId != userId && appointment.Coach?.UserId != userId)
                return Forbid("You are not allowed to update this appointment.");

            
            if (role == "Member")
            {
                if (dto.AppointmentDate.HasValue || dto.StartTime.HasValue || dto.EndTime.HasValue)
                    return BadRequest("Members cannot change appointment date or time. Please cancel and book a new slot.");

                if (!string.IsNullOrEmpty(dto.MeetingLink))
                    return BadRequest("Members cannot change the meeting link.");
            }

            if (dto.AppointmentDate.HasValue) appointment.AppointmentDate = dto.AppointmentDate.Value;
            if (dto.StartTime.HasValue) appointment.StartTime = dto.StartTime.Value;
            if (dto.EndTime.HasValue) appointment.EndTime = dto.EndTime.Value;
            if (dto.Notes != null) appointment.Notes = dto.Notes;
            if (dto.Status != null) appointment.Status = dto.Status;
            if (dto.MeetingLink != null) appointment.MeetingLink = dto.MeetingLink;

            appointment.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok("Appointment updated successfully.");
        }


        [HttpGet("MyMembers")]
        [Authorize(Roles = "Coach")]
        public async Task<ActionResult<IEnumerable<DTOMemberView>>> GetMyMembers()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var coachProfile = await _context.CoachProfiles.FirstOrDefaultAsync(c => c.UserId == userId);
            if (coachProfile == null)
                return Unauthorized("Coach profile not found.");

            var members = await _context.Appointments
                .Include(a => a.Member).ThenInclude(m => m.User)
                .Where(a => a.CoachId == coachProfile.CoachId && a.MemberId != null)
                .GroupBy(a => a.Member)
                .Select(g => new DTOMemberView
                {
                    MemberId = g.Key.MemberId,
                    Name = g.Key.User.DisplayName,
                    Email = g.Key.User.Email,
                    PhoneNumber = g.Key.User.PhoneNumber,

                    TotalAppointments = g.Count(),
                    CompletedAppointments = g.Count(a => a.Status == "Completed"),
                    CancelledAppointments = g.Count(a => a.Status == "Cancelled"),

                    NextAppointmentDate = g.Where(a => a.Status == "Scheduled" && a.AppointmentDate >= DateOnly.FromDateTime(DateTime.UtcNow))
                                           .OrderBy(a => a.AppointmentDate)
                                           .Select(a => a.AppointmentDate)
                                           .FirstOrDefault(),
                    NextAppointmentStartTime = g.Where(a => a.Status == "Scheduled" && a.AppointmentDate >= DateOnly.FromDateTime(DateTime.UtcNow))
                                                .OrderBy(a => a.AppointmentDate)
                                                .Select(a => a.StartTime)
                                                .FirstOrDefault(),
                    NextAppointmentEndTime = g.Where(a => a.Status == "Scheduled" && a.AppointmentDate >= DateOnly.FromDateTime(DateTime.UtcNow))
                                              .OrderBy(a => a.AppointmentDate)
                                              .Select(a => a.EndTime)
                                              .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(members);
        }


        private DTOAppointmentForRead MapToDTO(Appointment a)
        {
            return new DTOAppointmentForRead
            {
                AppointmentId = a.AppointmentId,
                MemberId = a.MemberId,
                CoachId = a.CoachId,
                MemberName = a.Member?.User?.DisplayName ?? "Unknown Member",
                CoachName = a.Coach?.Coach?.DisplayName ?? "Unknown Coach",
                AppointmentDate = a.AppointmentDate,
                Notes = a.Notes,
                MeetingLink = a.MeetingLink,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                CreatedAt = a.CreatedAt,
                Status = a.Status,
                UpdatedAt = a.UpdatedAt
            };
        }
    }
}
