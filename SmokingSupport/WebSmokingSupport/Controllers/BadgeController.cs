using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSupport.DTOs;
using WebSmokingSpport.DTOs;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Repositories;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class BadgeController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<Badge> _badgeRepository;
        private readonly IRankingService _rankingService;
        public BadgeController(QuitSmokingSupportContext context, IGenericRepository<Badge> badgeRepository, IRankingService rankingService)
        {
            _context = context;
            _badgeRepository = badgeRepository;
            _rankingService = rankingService;
        }
        [HttpGet("My-Badge")]
        //[Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOBadgeForRead>> GetMyBadge()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User not authenticated.");
            int userId = int.Parse(userIdClaim.Value);
            var member = await _context.Users
                .Include(m => m.UserBadges) 
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (member == null) return BadRequest("Member not found");

            var badges = await _context.UserBadges
                
                .Where(ub => ub.UserId == userId)
                .Select(ub => ub.Badge) 
                .ToListAsync();

            var badgeResponse = badges.Select(b => new DTOBadgeForRead
            {
                BadgeId = b.BadgeId,
                Name = b.Name,
                MemberNameOfBadge = member.DisplayName ?? "Unknown Member",
                RequiredScore = b.RequiredScore,
                Description = b.Description,
                IconUrl = b.IconUrl
            }).ToList();
            return Ok(badgeResponse);
        }
        [HttpGet("GetAllBadge")]
        //[Authorize(Roles = "Member, Coach, Admin")] 
        public async Task<ActionResult<IEnumerable<DTOBadgeForRead>>> GetAllBadges()
        {
            try
            {
                var badges = await _badgeRepository.GetAllAsync();
                if (badges == null || !badges.Any())
                {
                    return Ok(new List<DTOBadgeForRead>()); 
                }

                var badgeResponses = badges.Select(b => new DTOBadgeForRead
                {
                    BadgeId = b.BadgeId,    
                    RequiredScore = b.RequiredScore,
                    Name = b.Name,
                    Description = b.Description,
                    IconUrl = b.IconUrl
                }).ToList();

                return Ok(badgeResponses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi lấy huy hiệu: {ex.Message}");
            }
        }

        [HttpGet("{id:int}")]
        //[Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<DTOBadgeForRead>> GetBadgeById(int id)
        {
            try
            {
                var badge = await _badgeRepository.GetByIdAsync(id);
                if (badge == null)
                {
                    return NotFound($"Huy hiệu với ID {id} không tìm thấy.");
                }

                var dto = new DTOBadgeForRead
                {
                    BadgeId = badge.BadgeId,
                    RequiredScore = badge.RequiredScore,
                    Name = badge.Name,
                    Description = badge.Description,
                    IconUrl = badge.IconUrl
                };
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi lấy huy hiệu: {ex.Message}");
            }
        }
        [HttpPost("Create-Badge")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBadge([FromBody] DTOBadgeForCreate dto)
        {
            if (dto == null)
            {
                return BadRequest("Dữ liệu huy hiệu không hợp lệ.");
            }
            var badge = new Badge
            {
                Name = dto.Name,
                Description = dto.Description,
                RequiredScore = dto.RequiredScore,
                IconUrl = dto.IconUrl
            };
         
            try
            {
                int result = await _badgeRepository.CreateAsync(badge);
                if (result > 0)

                {
                    var allUserIds = await _context.Users.Select(u => u.UserId).ToListAsync();
                    foreach (var userId in allUserIds)
                    {
                        var ranking = await _context.Rankings.FirstOrDefaultAsync(r => r.UserId == userId);
                        if (ranking != null)
                        {
                            await _rankingService.CheckAndAwardBadges(userId, ranking?.Score?? 0);
                        }
                    }

                    return CreatedAtAction(nameof(GetBadgeById), new { id = badge.BadgeId }, badge);
                }
                else
                {
                    return StatusCode(500, "Không thể tạo huy hiệu mới.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi tạo huy hiệu: {ex.Message}");
            }
        }
        [HttpPut("Update-BadgeByBadgeId/{Badgeid}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<DTOBadgeForRead>> UpdateBadge(int Badgeid, [FromBody] DTOBadgeForUpdate dto)
        {
            var badge = await _badgeRepository.GetByIdAsync(Badgeid);
            if (badge == null)
            {
                return NotFound($"Huy hiệu với ID {Badgeid} không tìm thấy.");
            }
            badge.Name = dto.Name;
            badge.Description = dto.Description;
            badge.RequiredScore = dto.RequiredScore;
            badge.IconUrl = dto.IconUrl;
            _context.Update(badge);
            await _context.SaveChangesAsync();
            var updatedBadge = new DTOBadgeForRead
            {
                BadgeId = badge.BadgeId,
                Name = badge.Name,
                Description = badge.Description,
                RequiredScore = badge.RequiredScore,
                IconUrl = badge.IconUrl
            };
            return Ok(updatedBadge);
        }
        [HttpDelete("Delete-BadgeByBadgeId/{Badgeid}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBadgeById(int Badgeid)
        {
            var badge = await _badgeRepository.GetByIdAsync(Badgeid);
            if (badge == null)
            {
                return NotFound($"Huy hiệu với ID {Badgeid} không tìm thấy.");
            }
            try
            {
                bool isRemoved = await _badgeRepository.RemoveAsync(badge);
                if (isRemoved)
                {
                    return Ok($"Huy hiệu với ID {Badgeid} đã được xóa thành công.");
                }
                else
                {
                    return StatusCode(500, "Không thể xóa huy hiệu.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi xóa huy hiệu: {ex.Message}");
            }
        }
    }
}
