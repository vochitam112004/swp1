using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CurrentGoalController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        public CurrentGoalController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOMoneySavedResult>> CalculateMoneySaved()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
                return Unauthorized("User not authenticated.");

            var memberProfile = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);

            if (memberProfile == null)
                return NotFound("Member profile not found.");

            var currentGoalPlan = await _context.GoalPlans
                    .FirstOrDefaultAsync(gp => gp.MemberId == memberProfile.MemberId && gp.isCurrentGoal == true);

            if (currentGoalPlan == null)
            {
                return Ok(new DTOMoneySavedResult
                {
                    TotalMoneySaved = 0,
                    DaysReducedSmoking = 0,
                    DailyReductions = new List<DTODailyReduction>()
                });
            }

            var progressLogs = await _context.ProgressLogs
                .Where(pl => pl.GoalPlanId == currentGoalPlan.PlanId)
                .OrderBy(pl => pl.LogDate)
                .ToListAsync();

            decimal pricePerCigarette = (decimal)memberProfile.PricePerPack / memberProfile.CigarettesPerPack;
            decimal totalSaved = 0;
            int reducedDays = 0;

            var dailyReductions = new List<DTODailyReduction>();

            foreach (var log in progressLogs)
            {
                if (log.CigarettesSmoked.HasValue)
                {
                    int reduced = (memberProfile.CigarettesSmoked ?? 0) - log.CigarettesSmoked.Value;
                    if (reduced > 0)
                    {
                        totalSaved += reduced * pricePerCigarette;
                        reducedDays++;

                        dailyReductions.Add(new DTODailyReduction
                        {
                            Date = log.LogDate,
                            CigarettesReduced = reduced
                        });
                    }
                }
            }

            var result = new DTOMoneySavedResult
            {
                TotalMoneySaved = Math.Round(totalSaved, 0),
                DaysReducedSmoking = reducedDays,
                DailyReductions = dailyReductions
            };

            return Ok(result);
        }
    }
}