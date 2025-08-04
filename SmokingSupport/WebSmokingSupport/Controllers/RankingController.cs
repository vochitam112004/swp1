using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly ILogger<RankingController> _logger;

        public RankingController(QuitSmokingSupportContext context, ILogger<RankingController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet("get-ranking-by-reduced-days")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<IActionResult> GetRankingByReducedDays()
        {
            try
            {
                var memberProfiles = await _context.MemberProfiles
                    .Include(m => m.User)
                    .ToListAsync();

                var goalPlans = await _context.GoalPlans
                    .Where(gp => gp.isCurrentGoal == true)
                    .ToListAsync();

                var logs = await _context.ProgressLogs
                    .Include(pl => pl.GoalPlan)
                    .ToListAsync();

                var rankingList = new List<DTORankingByDays>();

                foreach (var member in memberProfiles)
                {
                    var memberGoalIds = goalPlans
                        .Where(gp => gp.MemberId == member.MemberId)
                        .Select(gp => gp.PlanId)
                        .ToList();

                    var memberLogs = logs
                        .Where(pl => pl.GoalPlan != null && memberGoalIds.Contains(pl.GoalPlan.PlanId))
                        .ToList();

                    int reducedDays = memberLogs.Count(log =>
                    {
                        int baseCigarettes = member.CigarettesSmoked ?? 0;
                        return log.CigarettesSmoked.HasValue && log.CigarettesSmoked.Value < baseCigarettes;
                    });

                    rankingList.Add(new DTORankingByDays
                    {
                        UserId = member.UserId,
                        Username = member.User?.Username ?? "(Unknown)",
                        ReducedDays = reducedDays
                    });
                }

                var sortedRanking = rankingList
                    .OrderByDescending(r => r.ReducedDays)
                    .ToList();

                return Ok(sortedRanking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating reduced days ranking.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}