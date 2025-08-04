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
        private readonly ILogger<CurrentGoalController> _logger;
        private readonly QuitSmokingSupportContext _context;
       public CurrentGoalController(ILogger<CurrentGoalController> logger, QuitSmokingSupportContext context)
        {
            _logger = logger;
            _context = context;
        }
        [HttpGet()]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CalculateMoneySaved()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var memberProfile = await _context.MemberProfiles
                    .FirstOrDefaultAsync(mp => mp.UserId == userId);

                if (memberProfile == null)
                {
                    return NotFound("Member profile not found.");
                }

                var progressLogs = await _context.ProgressLogs
                        .Include(pl => pl.GoalPlan)
                        .Where(pl => pl.GoalPlan != null
                            && pl.GoalPlan.MemberId == memberProfile.MemberId
                        && pl.GoalPlan.isCurrentGoal == true) 
                        .OrderBy(pl => pl.LogDate)
                        .ToListAsync();

                double pricePerCigarette = 0;
                var pricePerPack = memberProfile.PricePerPack;
                if (memberProfile.CigarettesPerPack != 0)
                {
                    pricePerCigarette = (double)(pricePerPack / memberProfile.CigarettesPerPack);
                }
                double totalSaved = 0;
                int reducedDays = 0;
                List<DTODailyReduction> dailyReductions = new();

                foreach (var log in progressLogs)
                {
                    if (log.CigarettesSmoked.HasValue)
                    {
                        int reduced = (memberProfile.CigarettesSmoked ?? 0) - log.CigarettesSmoked.Value;
                        totalSaved += reduced * pricePerCigarette;
                        if (reduced > 0)
                        {
                            reducedDays++;
                        }
                        dailyReductions.Add(new DTODailyReduction
                        {
                            Date = log.LogDate,
                            CigarettesReduced = reduced
                        });
                    }
                }

                var result = new DTOMoneySavedResult
                {
                    TotalMoneySaved = (decimal)Math.Round(totalSaved, 0),
                    DaysReducedSmoking = reducedDays,
                    DailyReductions = dailyReductions.OrderBy(d => d.Date).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while calculating money saved.");
                return StatusCode(500, "An error occurred while calculating money saved.");
            }
        }

    }
}