using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Service;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrentGoalController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IRankingService _rankingService;
        public CurrentGoalController(QuitSmokingSupportContext context ,IRankingService rankingService )
        {
            this._rankingService = rankingService;
            this._context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<ActionResult<DTOGoalPlanForCurrent>> GetCurrentGoal()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            int userId = int.Parse(userIdClaim.Value);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Lấy MemberProfile
            var member = await _context.MemberProfiles
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (member == null)
                return NotFound("Member profile not found.");

            // Lấy GoalPlan hiện tại
            var currentGoal = await _context.GoalPlans
                .Include(g => g.Member).ThenInclude(m => m.User)
                .FirstOrDefaultAsync(g =>
                    g.MemberId == member.MemberId &&
                    g.isCurrentGoal == true &&
                    g.StartDate <= today &&
                    g.TargetQuitDate >= today);

            if (currentGoal == null)
            {
                return NotFound("Bạn chưa có GoalPlan đang hoạt động.");
            }

            // Lấy tất cả ProgressLogs theo GoalPlanId
            var logs = await _context.ProgressLogs
                .Where(pl => pl.GoalPlanId == currentGoal.PlanId)
                .ToListAsync();

            // Nếu chưa có log nào
            if (logs.Count == 0)
            {
                return BadRequest("Bạn đã có GoalPlan nhưng chưa ghi nhật ký. Vui lòng tạo ProgressLog.");
            }

            int totalDays = (currentGoal.TargetQuitDate.Value.DayNumber - currentGoal.StartDate.Value.DayNumber) + 1;
            int dayNumber = (today.DayNumber - currentGoal.StartDate.Value.DayNumber) + 1;

            int totalCigarettes = logs.Sum(l => l.CigarettesSmoked ?? 0);

            decimal pricePerPack = logs
                .Where(l => l.PricePerPack.HasValue)
                .OrderByDescending(l => l.LogDate)
                .FirstOrDefault()?.PricePerPack ?? 0m;

            int cigarettesPerPack = logs
                .Where(l => l.CigarettesPerPack > 0)
                .OrderByDescending(l => l.LogDate)
                .FirstOrDefault()?.CigarettesPerPack ?? 20;

            decimal totalSpent = Math.Round(
                (totalCigarettes / (decimal)cigarettesPerPack) * pricePerPack, 2);

            int smokeFreeDays = logs.Count(l => (l.CigarettesSmoked ?? 0) == 0);

            var todayLog = logs.FirstOrDefault(l => l.LogDate == today);
           

            decimal todaySpent = todayLog != null
                ? Math.Round(((todayLog.CigarettesSmoked ?? 0) / (decimal)cigarettesPerPack) * pricePerPack, 2)
                : 0;

            var yesterdayDate = today.AddDays(-1);
            var yesterdayLog = logs.FirstOrDefault(l => l.LogDate == yesterdayDate);

            decimal yesterdaySpent = 0;
            if (yesterdayLog != null)
            {
                int yCigarettesPerPack = yesterdayLog.CigarettesPerPack > 0 ? yesterdayLog.CigarettesPerPack : 20;
                decimal yPricePerPack = yesterdayLog.PricePerPack ?? 0m;
                yesterdaySpent = Math.Round(
                    ((yesterdayLog.CigarettesSmoked ?? 0) / (decimal)yCigarettesPerPack) * yPricePerPack, 2);
            }
            // Tìm các ngày bị thiếu log
            var allDates = Enumerable.Range(0, totalDays)
                .Select(offset => currentGoal.StartDate.Value.AddDays(offset))
                .ToList();
            var loggedDates = logs.Select(l => l.LogDate).ToHashSet();
            var missingDates = allDates.Where(d => !loggedDates.Contains(d)).ToList();

            var result = new DTOGoalPlanForCurrent
            {
                StartDate = currentGoal.StartDate?.ToDateTime(TimeOnly.MinValue),
                TargetQuitDate = currentGoal.TargetQuitDate?.ToDateTime(TimeOnly.MinValue),
                memberDisplayName = currentGoal.Member?.User?.DisplayName,
                DayNumber = dayNumber,
                TotalDays = totalDays,
                MissingLogDates = missingDates,
                CigarettesPerPack = cigarettesPerPack,
                PersonalMotivation = currentGoal.PersonalMotivation,
                TotalCigarettesSmoked = totalCigarettes,
                TotalSpenMoney = totalSpent,
                TodaySpent = todaySpent,
                YesterdaySpent = yesterdaySpent,
                SmokeFreeDays = smokeFreeDays,
                Logs = logs.Select(l => new DTODailyLog
                {
                    LogDate = l.LogDate,
                    CigarettesSmoked = l.CigarettesSmoked,
                    PricePerPack = l.PricePerPack
                }).ToList()
            };
            await _rankingService.UpdateUserScoreAndBadges(userId, smokeFreeDays);  
            return Ok(result);
        }
    }
}
