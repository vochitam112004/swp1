﻿using Microsoft.AspNetCore.Http;
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
    [Authorize]
    public class BadgeController : ControllerBase
    {
        private readonly ILogger<BadgeController> _logger;
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<Badge> _badgeRepository;
        private readonly IRankingService _rankingService;
        public BadgeController(QuitSmokingSupportContext context, IGenericRepository<Badge> badgeRepository, IRankingService rankingService , ILogger<BadgeController> logger)
        {
            _context = context;
            _badgeRepository = badgeRepository;
            _rankingService = rankingService;
            _logger = logger;
        }
        [HttpGet("GetAllBadge")]
        [Authorize(Roles = "Member, Coach, Admin")]
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
        [Authorize(Roles = "Member, Coach, Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBadge([FromForm] DTOBadgeForCreate dto, [FromServices] IWebHostEnvironment _env)
        {
            if (dto == null)
                return BadRequest("Dữ liệu huy hiệu không hợp lệ.");

            string? iconUrl = null;
            if (dto.IconFile != null && dto.IconFile.Length > 0)
            {
                var uploadPath = Path.Combine(_env.ContentRootPath, "uploads", "badges");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.IconFile.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.IconFile.CopyToAsync(stream);
                }

                iconUrl = $"/uploads/badges/{fileName}";
            }

            var badge = new Badge
            {
                Name = dto.Name,
                Description = dto.Description,
                RequiredScore = dto.RequiredScore,
                IconUrl = iconUrl
            };

            try
            {
                int result = await _badgeRepository.CreateAsync(badge);
                if (result > 0)
                {
                    return CreatedAtAction(nameof(GetBadgeById), new { id = badge.BadgeId }, new DTOBadgeForRead
                    {
                        BadgeId = badge.BadgeId,
                        Name = badge.Name,
                        Description = badge.Description,
                        RequiredScore = badge.RequiredScore,
                        IconUrl = badge.IconUrl
                    });
                }
                return StatusCode(500, "Không thể tạo huy hiệu mới.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tạo huy hiệu: {ex.Message}");
            }
        }
        [HttpPut("Update-BadgeByBadgeId/{Badgeid}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DTOBadgeForRead>> UpdateBadge(int Badgeid, [FromForm] DTOBadgeForUpdate dto, [FromServices] IWebHostEnvironment _env)
        {
            var badge = await _badgeRepository.GetByIdAsync(Badgeid);
            if (badge == null)
                return NotFound($"Huy hiệu với ID {Badgeid} không tìm thấy.");

            badge.Name = dto.Name;
            badge.Description = dto.Description;
            badge.RequiredScore = dto.RequiredScore;

            if (dto.IconFile != null && dto.IconFile.Length > 0)
            {
                var uploadPath = Path.Combine(_env.ContentRootPath, "uploads", "badges");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.IconFile.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.IconFile.CopyToAsync(stream);
                }

                badge.IconUrl = $"/uploads/badges/{fileName}";
            }

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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBadgeById(int Badgeid)
        {
            var badge = await _badgeRepository.GetByIdAsync(Badgeid);
            if (badge == null)
            {
                return NotFound($"Huy hiệu với ID {Badgeid} không tìm thấy.");
            }

            try
            {
                var relatedUserBadges = await _context.UserBadges
                    .Where(ub => ub.BadgeId == Badgeid)
                    .ToListAsync();

                _context.UserBadges.RemoveRange(relatedUserBadges);
                await _context.SaveChangesAsync(); 

           
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
        [HttpGet("get-my-badges")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> GetMyBadges()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                var member = await _context.MemberProfiles
                    .Include(mp => mp.User)
                    .FirstOrDefaultAsync(mp => mp.UserId == userId);

                if (member == null)
                {
                    return NotFound("Member not found.");
                }

                var goalPlans = await _context.GoalPlans
                    .Where(gp => gp.isCurrentGoal == true && gp.MemberId == member.MemberId)
                    .ToListAsync();

                var memberGoalIds = goalPlans.Select(gp => gp.PlanId).ToList();

                var logs = await _context.ProgressLogs
                    .Include(pl => pl.GoalPlan)
                    .Where(pl => pl.GoalPlan != null && memberGoalIds.Contains(pl.GoalPlan.PlanId))
                    .ToListAsync();

                int reducedDays = logs.Count(log =>
                {
                    int baseCigs = member.CigarettesSmoked ?? 0;
                    return log.CigarettesSmoked.HasValue && log.CigarettesSmoked.Value < baseCigs;
                });

                int score = reducedDays * 10;

                var badges = await _context.Badges
                    .Where(b => score >= b.RequiredScore)
                    .Select(b => new DTOBadge
                    {
                        BadgeId = b.BadgeId,
                        Name = b.Name ?? "",
                        IconUrl = b.IconUrl
                    })
                    .ToListAsync();

                var result = new DTOUserWithBadges
                {
                    UserId = userId,
                    Username = member.User?.Username ?? "",
                    FullName = member.User?.DisplayName ?? "",
                    AvatarUrl = member.User?.AvatarUrl ?? "",
                    Score = score,
                    Badges = badges
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving my badges.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
