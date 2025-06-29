using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrentGoalController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        public CurrentGoalController(QuitSmokingSupportContext context)
        {
            this._context = context;
        }
        [HttpGet("current-goal")]
        [Authorize]
        public async Task<ActionResult<DTOGoalPlanForCurrent>> GetCurrentGoal()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == int.Parse(userIdClaim.Value));
            if (member == null)
            {
                return NotFound("Member profile not found.");
            }

            var currentDate = DateOnly.FromDateTime(DateTime.UtcNow);

            var goal = await _context.GoalPlans
                .Where(g => g.MemberId == member.MemberId &&
                            g.StartDate <= currentDate &&
                            g.TargetQuitDate >= currentDate)
                .OrderByDescending(g => g.StartDate)
                .FirstOrDefaultAsync();

            if (goal == null)
            {
                return NotFound("No current goal found for this member.");
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var yesterday = today.AddDays(-1);

            int dayNumber = goal.StartDate.HasValue
                ? (today.DayNumber - goal.StartDate.Value.DayNumber) + 1
                : 0;

            int totalDays = (goal.StartDate.HasValue && goal.TargetQuitDate.HasValue)
                ? (goal.TargetQuitDate.Value.DayNumber - goal.StartDate.Value.DayNumber) + 1
                : 0;

            var logs = await _context.ProgressLogs
                .Where(log => log.MemberId == member.MemberId &&
                              log.LogDate >= goal.StartDate &&
                              log.LogDate <= goal.TargetQuitDate)
                .ToListAsync();

            int totalCigarettesSmoked = logs.Sum(log => log.CigarettesSmoked ?? 0);

            decimal totalSpent = logs.Sum(l => ((l.CigarettesSmoked ?? 0) / 20m) * (l.PricePerPack ?? 0));

            // Tính riêng tiền hôm nay và hôm qua (nếu cần dùng)
            decimal todaySpent = logs
                .Where(l => l.LogDate == today)
                .Sum(l => ((l.CigarettesSmoked ?? 0) / 20m) * (l.PricePerPack ?? 0));

            decimal yesterdaySpent = logs
                .Where(l => l.LogDate == yesterday)
                .Sum(l => ((l.CigarettesSmoked ?? 0) / 20m) * (l.PricePerPack ?? 0));

            var goalPlanResponse = new DTOGoalPlanForCurrent
            {
                StartDate = goal.StartDate?.ToDateTime(TimeOnly.MinValue),
                TargetQuitDate = goal.TargetQuitDate?.ToDateTime(TimeOnly.MinValue),
                DayNumber = Math.Max(dayNumber, 0),
                TotalDays = Math.Max(totalDays, 0),
                PersonalMotivation = goal.PersonalMotivation,
                TotalCigarettesSmoked = totalCigarettesSmoked,
                TotalSpenMoney = Math.Round(totalSpent, 2),
                Logs = logs.Select(log => new DTODailyLog
                {
                    LogDate = log.LogDate,
                    CigarettesSmoked = log.CigarettesSmoked,
                    PricePerPack = log.PricePerPack
                }).ToList(),
                TodaySpent = Math.Round(todaySpent, 2),
                YesterdaySpent = Math.Round(yesterdaySpent, 2),

            };

            return Ok(goalPlanResponse);
        }

    }
}
