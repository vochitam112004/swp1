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

        [HttpPost("generate-weekly-schedule")]
        public async Task<IActionResult> GenerateWeeklySchedule([FromBody] DTOWeeklyReductionRangeForCreate dto)
        {
            var goalPlan = await _context.GoalPlans
                .FirstOrDefaultAsync(gp => gp.PlanId == dto.GoalPlanId);

            if (goalPlan == null)
                return NotFound("GoalPlan not found.");

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

                reductions.Add(new GoalPlanWeeklyReduction
                {
                    GoalPlanId = dto.GoalPlanId,
                    WeekNumber = i + 1,
                    CigarettesReduced = 0,
                    StartDate = weekStart,
                    EndDate = weekEnd
                });
            }

            _context.GoalPlanWeeklyReductions.AddRange(reductions);
            await _context.SaveChangesAsync();

            return Ok(reductions);
        }
    }
}
