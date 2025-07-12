using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using WebSmokingSupport.Entity;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalCurrentSummaryController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        public GoalCurrentSummaryController(QuitSmokingSupportContext context)
        {
            this._context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<ActionResult> GetAssignedMembers()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == "Coach" || userRole == "Admin")
            {
                var allMembers = await _context.MemberProfiles
                    .Include(m => m.User)
                    .Include(m => m.GoalPlans
                        .Where(gp => gp.isCurrentGoal == true)) 
                        .ThenInclude(gp => gp.ProgressLogs
                            .OrderByDescending(pl => pl.LogDate)
                            .ThenByDescending(pl => pl.CreatedAt)) 
                    .ToListAsync();

                var result = allMembers.Select(member =>
                {
                    var currentGoal = member.GoalPlans.FirstOrDefault(); 
                    var logs = currentGoal?.ProgressLogs ?? new List<ProgressLog>();

                    int totalCigarettes = logs.Sum(l => l.CigarettesSmoked ?? 0);
                    int cigarettesPerPack = logs.FirstOrDefault()?.CigarettesPerPack ?? 20;
                    decimal pricePerPack = logs.FirstOrDefault()?.PricePerPack ?? 0m;

                    decimal totalSpent = (cigarettesPerPack != 0)
                        ? Math.Round((totalCigarettes / (decimal)cigarettesPerPack) * pricePerPack, 2)
                        : 0m;

                    int smokeFreeDays = logs.Count(l => (l.CigarettesSmoked ?? 0) == 0);
                    string? latestMood = logs.FirstOrDefault()?.Mood;

                    return new
                    {
                        UserId = member.UserId,
                        NameDisplay = member.User?.DisplayName,
                        SmokeFreeDays = smokeFreeDays,
                        TotalSpentMoney = totalSpent,
                        LatestMood = latestMood
                    };
                }).ToList();

                return Ok(result);
            }

            return Forbid("You do not have permission to access this resource.");
        }
    }
}
