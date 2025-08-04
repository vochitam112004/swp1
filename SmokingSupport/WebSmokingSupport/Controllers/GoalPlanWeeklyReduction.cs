using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalPlanWeeklyReductionController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public GoalPlanWeeklyReductionController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet("generate-weekly-schedule")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> GenerateWeeklySchedule()
        {
            // Lấy userId từ token đăng nhập
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Tìm GoalPlan đang hoạt động (isCurrentGoal = true)
            var goalPlan = await _context.GoalPlans
                .Where(gp => gp.UserId == int.Parse(userId) && gp.isCurrentGoal == true)
                .FirstOrDefaultAsync();

            if (goalPlan == null)
                return NotFound("Không tìm thấy GoalPlan đang hoạt động.");

            var startDate = goalPlan.StartDate;
            var endDate = goalPlan.EndDate;

            int totalDays = endDate.DayNumber - startDate.DayNumber + 1;
            int numberOfWeeks = (int)Math.Ceiling(totalDays / 7.0);

            var reductions = new List<GoalPlanWeeklyReduction>();

            for (int i = 0; i < numberOfWeeks; i++)
            {
                var weekStart = startDate.AddDays(i * 7);
                var weekEnd = weekStart.AddDays(6);
                if (weekEnd > endDate)
                    weekEnd = endDate;

                // Tính tổng số điếu thuốc đã hút trong tuần đó từ ProgressLog
                var totalCigarettes = await _context.ProgressLogs
                    .Where(p => p.GoalPlanId == goalPlan.PlanId
                         && DateOnly.FromDateTime(p.LogDate) >= weekStart
                            && DateOnly.FromDateTime(p.LogDate) <= weekEnd)
                        .SumAsync(p => (int?)p.CigarettesSmoked) ?? 0;

                reductions.Add(new GoalPlanWeeklyReduction
                {
                    GoalPlanId = goalPlan.PlanId,
                    WeekNumber = i + 1,
                    CigarettesReduced = totalCigarettes,
                    StartDate = weekStart,
                    EndDate = weekEnd
                });
            }

            _context.GoalPlanWeeklyReductions.AddRange(reductions);
            await _context.SaveChangesAsync();

            var reductionDtos = reductions.Select(r => new DTOGoalPlanWeeklyReductionForRead
            {
                WeeklyReductionId = r.WeeklyReductionId,
                GoalPlanId = r.GoalPlanId,
                WeekNumber = r.WeekNumber,
                CigarettesReduced = r.CigarettesReduced,
                StartDate = r.StartDate,
                EndDate = r.EndDate
            }).ToList();

            return Ok(reductionDtos);
        }
    }
}
