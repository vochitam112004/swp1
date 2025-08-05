using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAchievementController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public UserAchievementController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet("{userId}")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<ActionResult<IEnumerable<UserAchievement>>> GetByUser(int userId)
        {
            var achievements = await _context.UserAchievements
                .Include(ua => ua.Template)
                .Where(ua => ua.UserId == userId)
                .ToListAsync();
            return Ok(achievements);
        }

        [HttpPost("assign-by-money")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> AssignAchievementBasedOnMoneySaved()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated");

            int userId = int.Parse(userIdClaim);

            var memberProfile = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
                return NotFound("Member profile not found.");

            var progressLogs = await _context.ProgressLogs
                .Include(pl => pl.GoalPlan)
                .Where(pl => pl.GoalPlan != null
                          && pl.GoalPlan.MemberId == memberProfile.MemberId
                          && pl.GoalPlan.isCurrentGoal == true)
                .ToListAsync();

            double pricePerCigarette = 0;
            if (memberProfile.CigarettesPerPack > 0)
            {
                pricePerCigarette = (double)(memberProfile.PricePerPack / memberProfile.CigarettesPerPack);
            }

            double totalSaved = 0;

            foreach (var log in progressLogs)
            {
                if (log.CigarettesSmoked.HasValue)
                {
                    int reduced = (memberProfile.CigarettesSmoked ?? 0) - log.CigarettesSmoked.Value;
                    if (reduced > 0)
                        totalSaved += reduced * pricePerCigarette;
                }
            }

            // Lấy danh sách achievement có yêu cầu về số tiền tiết kiệm
            var moneyAchievements = await _context.AchievementTemplates
                .Where(a => a.RequiredSmokeFreeDays != null)
                .OrderBy(a => a.RequiredSmokeFreeDays)
                .ToListAsync();

            var userAchievements = await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.TemplateId)
                .ToListAsync();

            var newAchievements = new List<UserAchievement>();

            foreach (var achievement in moneyAchievements)
            {
                if (totalSaved >= achievement.RequiredSmokeFreeDays &&
                    !userAchievements.Contains(achievement.TemplateId))
                {
                    newAchievements.Add(new UserAchievement
                    {
                        UserId = userId,
                        TemplateId = achievement.TemplateId,
                        LastUpdated = DateTime.UtcNow
                    });
                }
            }

            if (!newAchievements.Any())
            {
                return Ok("No new achievement assigned.");
            }

            _context.UserAchievements.AddRange(newAchievements);
            await _context.SaveChangesAsync();

            return Ok(newAchievements.Select(a => new
            {
                a.TemplateId,
                a.UserId,
                a.LastUpdated
            }));
        }

        [HttpDelete("{userId}/{templateId}")]
        [Authorize(Roles ="Coach,Admin")]
        public async Task<IActionResult> DeleteAchievement(int userId, int templateId)
        {
            var achievement = await _context.UserAchievements
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.TemplateId == templateId);

            if (achievement == null)
                return NotFound("Achievement not found.");

            _context.UserAchievements.Remove(achievement);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
