using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSupport.DTOs;
using WebSmokingSpport.DTOs;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserBadgeController : ControllerBase
    {
        private readonly IGenericRepository<UserBadge> _userBadgeRepository;
        public UserBadgeController(IGenericRepository<UserBadge> userBadgeRepository)
        {
            _userBadgeRepository = userBadgeRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOUserBadgeForRead>>> GetAllUserBadge()
        {
            var userBadges = await _userBadgeRepository.GetAllAsync();
            if (userBadges == null || !userBadges.Any())
            {
                return NotFound("No user badges found.");
            }
            var userBadgeResponse = userBadges.Select(ub => new DTOUserBadgeForRead
            {
                UserId = ub.UserId,
                BadgeId = ub.BadgeId,
                name = ub.Badge?.Name,
                Description = ub.Badge?.Description,
                DisplayName = ub.User?.DisplayName,
                earned_at = ub.EarnedAt,
                IconUrl = ub.Badge?.IconUrl
            }).ToList();
            return Ok(userBadgeResponse);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<DTOUserBadgeForRead>> GetUserBadgeById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid user badge ID.");
            }
            var userBadge = await _userBadgeRepository.GetByIdAsync(id);
            if (userBadge == null)
            {
                return NotFound($"User badge with ID {id} not found.");
            }
            var userBadgeResponse = new DTOUserBadgeForRead
            {
                UserId = userBadge.UserId,
                BadgeId = userBadge.BadgeId,
                name = userBadge.Badge?.Name,
                Description = userBadge.Badge?.Description,
                DisplayName = userBadge.User?.DisplayName,
                earned_at = userBadge.EarnedAt,
                IconUrl = userBadge.Badge?.IconUrl
            };
            return Ok(userBadgeResponse);
        }
        [HttpPost]
        public async Task<ActionResult> CreateUserBage([FromBody] DTOUserBadgeForCreate userbadgeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userBadge = new UserBadge
            {
                UserId = userbadgeDto.UserId,
                BadgeId = userbadgeDto.BadgeId,
                EarnedAt = userbadgeDto.EarnedAt ?? DateTime.UtcNow
            };
            await _userBadgeRepository.CreateAsync(userBadge);
            return CreatedAtAction(nameof(GetUserBadgeById), new { id = userBadge.UserId }, userBadge);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUserBadge(int id, [FromBody] DTOUserBadgeForCreate userbadgeDto)
        {
            if (id <= 0 || !ModelState.IsValid)
            {
                return BadRequest("Invalid user badge data.");
            }
            var userBadge = await _userBadgeRepository.GetByIdAsync(id);
            if (userBadge == null)
            {
                return NotFound($"User badge with ID {id} not found.");
            }
            userBadge.UserId = userbadgeDto.UserId;
            userBadge.BadgeId = userbadgeDto.BadgeId;
            userBadge.EarnedAt = userbadgeDto.EarnedAt ?? DateTime.UtcNow;
            await _userBadgeRepository.UpdateAsync(userBadge);
            return NoContent();
        }
        [HttpDelete("{userId}/{badgeId}")]
        public async Task<IActionResult> DeleteUserBadge(int userId, int badgeId)
        {
            var userBadge = await _userBadgeRepository.GetAllAsync();
            var badgeToDelete = userBadge.FirstOrDefault(ub => ub.UserId == userId && ub.BadgeId == badgeId);

            if (badgeToDelete == null)
            {
                return NotFound("UserBadge not found.");
            }

            var success = await _userBadgeRepository.RemoveAsync(badgeToDelete);
            if (!success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete UserBadge.");
            }

            return Ok("Deleted successfully.");
        }
    }
}
