using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        [HttpPost("CreateAppointment")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<DTOAppointmentForRead>> CreateAppoitment([FromBody] DTOAppointmentForCreate dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid appointment data.");
            }
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaims) || !int.TryParse(userIdClaims, out int userId) || userId <= 0)
            {
                return Unauthorized("You are not authorized to create an appointment.");
            }
            var roles = User.FindFirst(ClaimTypes.Role)?.Value;
            int memberId = 0;
            int CoachId = 0;

            if (roles == "Member")
            {
                var memberProfile = await _context.MemberProfiles
                    .Include(mp => mp.User)
                    .FirstOrDefaultAsync(mp => mp.UserId == userId);
                if(memberProfile == null)
                {
                    return NotFound("Member profile not found.");
                }
                memberId = memberProfile.MemberId;

                var coach = await _context.CoachProfiles
                    .Include(cp => cp.Coach)
                    .FirstOrDefaultAsync(cp => cp.UserId == dto.stagerId);
                if (coach == null)
                {
                    return NotFound("Coach not found.");
                }
                CoachId = coach.CoachId;
            }
            else if(roles == "Coach")
            {
                var coachProfile = await _context.CoachProfiles
                    .Include(cp => cp.Coach)
                    .FirstOrDefaultAsync(cp => cp.UserId == userId);
                if (coachProfile == null)
                {
                    return NotFound("Coach profile not found.");
                }
                CoachId = coachProfile.CoachId;
                var memberProfile = await _context.MemberProfiles
                    .Include(mp => mp.User)
                    .FirstOrDefaultAsync(mp => mp.UserId == dto.stagerId);
                if (memberProfile == null)
                {
                    return NotFound("Member profile not found.");
                }
                memberId = memberProfile.MemberId;
            }
            else
            {
                return Unauthorized("You are not authorized to create an appointment.");
            }

            //check schedule conflict
            bool conflict = await _context.Appointments.AnyAsync(a =>
                a.CoachId == CoachId &&
                a.AppointmentDate == dto.AppointmentDate &&
                a.StartTime < dto.EndTime &&
                dto.StartTime < a.EndTime);

            if (conflict)
            {
                return Conflict("Appointment time overlaps with another booking.");
            }

            var appointment = new Appointment
            {
                MemberId = memberId,
                CoachId = CoachId,
                AppointmentDate = dto.AppointmentDate,
                Notes = dto.Notes,
                MeetingLink = dto.MeetingLink,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                CreatedAt = DateTime.UtcNow,
                Status = "Scheduled"
                
            };
            
            await _appointmentRepository.CreateAsync(appointment);

            // Load lại appointment vừa tạo kèm Member và Coach
            var createdAppointment = await _context.Appointments
                .Include(a => a.Member).ThenInclude(m => m.User)
                .Include(a => a.Coach).ThenInclude(c => c.Coach)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointment.AppointmentId);

            return Ok(new DTOAppointmentForRead
            {
                AppointmentId = appointment.AppointmentId,
                MemberId = appointment.MemberId,
                CoachId = appointment.CoachId,
                MemberName = appointment.Member?.User?.DisplayName ?? "Unknown Member",
                CoachName = appointment.Coach?.Coach?.DisplayName ?? "Unknown Coach",
                AppointmentDate = appointment.AppointmentDate,
                Notes = appointment.Notes,
                MeetingLink = appointment.MeetingLink,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                CreatedAt = appointment.CreatedAt,
                Status = appointment.Status,
                UpdatedAt = appointment.UpdatedAt
            });
        }
        [HttpGet("GetAppointments")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<DTOAppointmentForRead>> GetAllAppointment()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaims) || !int.TryParse(userIdClaims, out int userId) || userId <= 0)
            {
                return Unauthorized("You are not authorized to view appointments.");
            }
            var roles = User.FindFirst(ClaimTypes.Role)?.Value;
            IQueryable<Appointment> appointmentsQuery;

            // 🔹 Nếu là Member => chỉ xem appointment của chính mình
            if (roles == "Member")
            {
                appointmentsQuery = _context.Appointments
                    .Where(a => a.Member.UserId == userId)
                    .Include(a => a.Member)
                        .ThenInclude(m => m.User)
                    .Include(a => a.Coach)
                        .ThenInclude(c => c.Coach);
            }
            else if (roles == "Coach")
            {
                appointmentsQuery = _context.Appointments
                    .Where(a => a.Coach.UserId == userId)
                    .Include(a => a.Member)
                        .ThenInclude(m => m.User)
                    .Include(a => a.Coach)
                        .ThenInclude(c => c.Coach);
            }
            else
            {
                return Unauthorized("You are not authorized to view appointments.");
            }
            var appointments = await appointmentsQuery.ToListAsync();

            if (appointments.Count == 0)
            {
                return NotFound("No appointments found.");
            }
            var appointmentDtos = appointments.Select(a => new DTOAppointmentForRead
            {
                AppointmentId = a.AppointmentId,
                MemberId = a.MemberId,
                MemberUserId = a.Member?.UserId,
                CoachId = a.CoachId,
                CoachUserId = a.Coach?.UserId,
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
            }).ToList();
            return Ok(appointmentDtos);
        }
        [HttpGet("by-date")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<IEnumerable<DTOAppointmentForRead>>> GetAppointmentsByDate([FromQuery] DateOnly date)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Member)
                .ThenInclude(m => m.User)
                .Include(a => a.Coach)
                .ThenInclude(c => c.Coach)
                .Where(a => a.AppointmentDate == date)
                .ToListAsync();

            var result = appointments.Select(a => new DTOAppointmentForRead
            {
                AppointmentId = a.AppointmentId,
                MemberId = a.MemberId,
                MemberName = a.Member?.User?.DisplayName,
                CoachId = a.CoachId,
                CoachName = a.Coach?.Coach?.DisplayName,
                AppointmentDate = a.AppointmentDate,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status,
                Notes = a.Notes,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                MeetingLink = a.MeetingLink
            }).ToList();

            return Ok(result);
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateAppointment(int id, [FromBody] DTOAppoitmentForUpdate dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Member)
                .Include(a => a.Coach)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
                return NotFound("Appointment not found");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);

        
            if (appointment.Member?.UserId != userId && appointment.Coach?.CoachId != userId)
                return Forbid("You are not allowed to update this appointment.");
            if(!string.IsNullOrEmpty(dto.MeetingLink))
            {
                appointment.MeetingLink = dto.MeetingLink;
            }
            if (dto.AppointmentDate.HasValue)
            {
                appointment.AppointmentDate = dto.AppointmentDate.Value;
            }
            if (dto.StartTime.HasValue)
            {
                appointment.StartTime = dto.StartTime.Value;
            }
            if (dto.EndTime.HasValue)
            {
                appointment.EndTime = dto.EndTime.Value;
            }
            if (!string.IsNullOrEmpty(dto.Notes))
            {
                appointment.Notes = dto.Notes;
            }
            if (!string.IsNullOrEmpty(dto.Status))
            {
                appointment.Status = dto.Status;
            }
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("Appointment updated successfully.");
        }
    }
}
