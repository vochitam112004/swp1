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
    public class BadgeController : ControllerBase
    {
        private readonly IGenericRepository<Badge> _badgeRepository;
        public BadgeController(IGenericRepository<Badge> badgeRepository)
        {
            _badgeRepository = badgeRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOBadgeForRead>>> GetAllBage()
        {
            var Badge = await _badgeRepository.GetAllAsync();
            var BadgeResponse = Badge.Select(b => new DTOBadgeForRead
            {
                BadgeId = b.BadgeId,
                Name = b.Name,
                Description = b.Description,
                IconUrl = b.IconUrl,
            }).ToList();
            return Ok(BadgeResponse);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<DTOUserBadgeForRead>> GetBageById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("invalid badgeId data");
            }
            var Badge = await _badgeRepository.GetByIdAsync(id);
            if (Badge == null)
            {
                return NotFound($"Not found Badge with{id}");
            }
            var BadgeReponse = new DTOBadgeForRead
            {
                BadgeId = Badge.BadgeId,
                Name = Badge.Name,
                Description = Badge.Description,
                IconUrl = Badge.IconUrl,
            };
            return Ok(BadgeReponse);
        }
        [HttpPost]
        public async Task<ActionResult<DTOBadgeForCreate>> CreateBadge([FromBody] DTOBadgeForCreate badgeDto)
        {
            if (badgeDto == null)
            {
                return BadRequest("Invalid Badge data");
            }
            var Badge = new Badge
            {
                Name = badgeDto.Name,
                Description = badgeDto.Description,
                IconUrl = badgeDto.IconUrl,
            };
            await _badgeRepository.CreateAsync(Badge);
            return CreatedAtAction(nameof(GetBageById), new { id = Badge.BadgeId, badgeDto });
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<DTOBadgeForUpdate>> UpdateBadge(int id, [FromBody] DTOBadgeForUpdate badDto)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid Badge ID.");
            }
            var Badge = await _badgeRepository.GetByIdAsync(id);
            if (Badge == null)
            {
                return NotFound($"Badge with ID {id} not found.");
            }
            Badge.Name = badDto.Name;
            Badge.Description = badDto.Description;
            badDto.IconUrl = badDto.IconUrl;
            await _badgeRepository.UpdateAsync(Badge);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBadge(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid badge ID.");
            }
            var Badge = await _badgeRepository.GetByIdAsync(id);
            if (Badge == null)
            {
                return NotFound($"Badge with ID {id} not found.");
            }
            await _badgeRepository.RemoveAsync(Badge);
            return NoContent();
        }
    }
}
