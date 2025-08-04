using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Data;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSupport.DTOs;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TriggerFactorController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<TriggerFactor> _triggerFactorRepository;
        public TriggerFactorController(QuitSmokingSupportContext context, IGenericRepository<TriggerFactor> triggerFactorRepository)
        {
            _context = context;
            _triggerFactorRepository = triggerFactorRepository;
        }
        [HttpGet("GetAllTriggerFactor")]
        [Authorize(Roles = "Admin,Member ,Coach")]
        public async Task<ActionResult<DTOTriggerFactorForRead>> GetAllTriggerFactor()
        {
            var triggerFactors = await _triggerFactorRepository.GetAllAsync();
            if (triggerFactors == null || !triggerFactors.Any())
            {
                return NotFound("No trigger factors found.");
            }
            var dtoTriggerFactors = triggerFactors.Select(tf => new DTOTriggerFactorForRead
            {
                TriggerId = tf.TriggerId,
                Name = tf.Name,
                CreatedAt = tf.CreatedAt,
                UpdatedAt = tf.UpdatedAt

            }).ToList();
            return Ok(dtoTriggerFactors);
        }
        [HttpGet("Get-MyTriggerFactor")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<ActionResult<IEnumerable<DTOTriggerFactorForRead>>> GetMyTriggerFactors()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User not authenticated.");

            int userId = int.Parse(userIdClaim.Value);

            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null) return BadRequest("Member not found");

            var triggerFactors = await _context.MemberTriggers
                .Where(mt => mt.MemberId == member.MemberId)
                .Include(mt => mt.Trigger)
                .Select(mt => new DTOTriggerFactorForRead
                {
                    TriggerId = mt.Trigger!.TriggerId,
                    Name = mt.Trigger.Name,
                    CreatedAt = mt.Trigger.CreatedAt,
                    UpdatedAt = mt.Trigger.UpdatedAt
                })
                .ToListAsync();

            return Ok(triggerFactors);
        }
        [HttpPost("Create-TriggerFactor")]
        [Authorize(Roles = "Admin,Coach,Member")]
        public async Task<IActionResult> CreateTriggerFactor([FromBody] DTOTriggerFactorForCreate triggerFactor)
        {
            if (triggerFactor == null)
            {
                return BadRequest("Trigger factor data is null.");
            }
            var newTriggerFactor = new TriggerFactor
            {
                Name = triggerFactor.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var result = await _triggerFactorRepository.CreateAsync(newTriggerFactor);
            var triigerResponse = new DTOTriggerFactorForCreate
            {

                Name = newTriggerFactor.Name,
                CreatedAt = newTriggerFactor.CreatedAt,
            };
            if (result <= 0)
            {
                return BadRequest("Failed to create trigger factor.");
            }
            return CreatedAtAction(nameof(GetAllTriggerFactor), new { id = newTriggerFactor.TriggerId }, newTriggerFactor);

        }
        [HttpPut("Update-TriggerFactor/{id}")]
        [Authorize(Roles = "Admin,Coach,Member")]
        public async Task<IActionResult> UpdateTriggerFactor(int id, [FromBody] DTOTriggerFactorForUpdate triggerFactor)
        {
            var existingTriggerFactor = await _triggerFactorRepository.GetByIdAsync(id);
            if (existingTriggerFactor == null)
            {
                return NotFound("Trigger factor not found.");
            }
            if (!string.IsNullOrWhiteSpace(triggerFactor.Name))
            {
                existingTriggerFactor.Name = triggerFactor.Name;
            }
            existingTriggerFactor.UpdatedAt = DateTime.UtcNow;
            var result = await _triggerFactorRepository.UpdateAsync(existingTriggerFactor);
            if (result <= 0)
            {
                return BadRequest("Failed to update trigger factor.");
            }
            return NoContent();
        }
        [HttpDelete("removeTriggerFactorAtMember/{triggerId}")]
        [Authorize(Roles = "Admin,Coach,Member")]
        public async Task<ActionResult> RemoveTrigger(int triggerId)
        {

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            int userId = int.Parse(userIdClaim);

            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null)
                return NotFound("Member not found.");

            var existingTrigger = await _context.MemberTriggers
                .FirstOrDefaultAsync(mt => mt.MemberId == member.MemberId && mt.TriggerId == triggerId);

            if (existingTrigger == null)
                return NotFound("Trigger not assigned to this member.");

            _context.MemberTriggers.Remove(existingTrigger);
            await _context.SaveChangesAsync();

            return Ok("Trigger removed successfully.");
        }

        [HttpPost("assign/{memberId}")]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<ActionResult> AssignTriggersToMember(int memberId, [FromBody] List<int> triggerIds)
        {
            var member = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.MemberId == memberId);
            if (member == null)
                return NotFound("Member not found.");

            if (triggerIds == null || !triggerIds.Any())
                return BadRequest("Trigger list is empty.");

            var validTriggerIds = await _context.TriggerFactors
                .Where(t => triggerIds.Contains(t.TriggerId))
                .Select(t => t.TriggerId)
                .ToListAsync();

            if (validTriggerIds.Count != triggerIds.Count)
                return BadRequest("Some trigger IDs are invalid.");

            // Lấy các trigger đã gán sẵn cho member
            var existingTriggerIds = await _context.MemberTriggers
                .Where(mt => mt.MemberId == memberId)
                .Select(mt => mt.TriggerId)
                .ToListAsync();

            // Lọc ra các trigger mới chưa được gán
            var newTriggerIds = validTriggerIds
                .Where(id => !existingTriggerIds.Contains(id))
                .ToList();

            // Gán các trigger mới
            foreach (var triggerId in newTriggerIds)
            {
                _context.MemberTriggers.Add(new MemberTrigger
                {
                    MemberId = memberId,
                    TriggerId = triggerId
                });
            }

            await _context.SaveChangesAsync();
            var allTriggerIds = existingTriggerIds
                .Select(id => id.Value) // ép từ int? về int
                .Union(newTriggerIds)
                .ToList();


            var assignedTriggers = await _context.TriggerFactors
                .Where(t => allTriggerIds.Contains(t.TriggerId))
                .ToListAsync();

            var response = assignedTriggers.Select(t => new DTOTriggerFactorForRead
            {
                TriggerId = t.TriggerId,
                Name = t.Name,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            }).ToList();

            return Ok(response);
        }

        [HttpDelete("Delete-TriggerFactor/{id}")]
        [Authorize(Roles = "Admin,Coach,Member")]
        public async Task<IActionResult> DeleteTriggerFactor(int id)
        {
            var existingTriggerFactor = await _triggerFactorRepository.GetByIdAsync(id);
            if (existingTriggerFactor == null)
            {
                return NotFound("Trigger factor not found.");
            }
            var result = await _triggerFactorRepository.RemoveAsync(existingTriggerFactor);
            return NoContent();
        }
    }
}
