using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Data;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSupport.DTOs;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

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
        [Authorize(Roles = "Admin,Memer,Coach")]
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
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null) return BadRequest("Member not found");
            var triggerFactors = await _context.TriggerFactors
                .Where(tf => tf.TriggerId == member.MemberId)
                .Select(tf => new DTOTriggerFactorForRead
                {
                    TriggerId = tf.TriggerId,
                    Name = tf.Name,
                    CreatedAt = tf.CreatedAt,
                    UpdatedAt = tf.UpdatedAt
                })
                .ToListAsync();
            return Ok(triggerFactors);
        }
        [HttpPost("Create-TriggerFactor")]
        [Authorize(Roles = "Admin,Coach,Member")]
        public async Task<IActionResult> CreateTriggerFactor([FromBody] TriggerFactor triggerFactor)
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
            var triigerResponse = new DTOTriggerFactorForRead
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
        public async Task<IActionResult> UpdateTriggerFactor(int id, [FromBody] TriggerFactor triggerFactor)
        {
            if (triggerFactor == null || id != triggerFactor.TriggerId)
            {
                return BadRequest("Invalid trigger factor data.");
            }
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var member = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == int.Parse(userId));
            if (member == null)
                return NotFound("Member not found.");

            var existing = await _context.MemberTriggers
                .FirstOrDefaultAsync(mt => mt.MemberId == member.MemberId && mt.TriggerId == triggerId);

            if (existing == null)
                return NotFound("Trigger not assigned.");

            _context.MemberTriggers.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok("Trigger removed.");
        }
        [HttpPost("assign")]
        public async Task<ActionResult> AssignTriggersToMember([FromBody] List<int> triggerIds)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var member = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == int.Parse(userId));
            if (member == null)
                return NotFound("Member not found.");

            // Xoá tất cả trigger cũ (nếu muốn reset)
            var existing = _context.MemberTriggers.Where(mt => mt.MemberId == member.MemberId);
            _context.MemberTriggers.RemoveRange(existing);

            // Gán mới
            foreach (var triggerId in triggerIds)
            {
                _context.MemberTriggers.Add(new MemberTrigger
                {
                    MemberId = member.MemberId,
                    TriggerId = triggerId
                });
            }

            await _context.SaveChangesAsync();
            return Ok("Trigger factors assigned successfully.");
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
