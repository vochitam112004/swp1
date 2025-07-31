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
        [Authorize(Roles = "Coach,Admin,Member")]
        public async Task<ActionResult> GetCurrentGoalSummariesForMembers() // Renamed for clarity
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == "Coach" || userRole == "Admin")
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);

                var allMembers = await _context.MemberProfiles
                    .Include(m => m.User)
                    .Include(m => m.GoalPlans.Where(gp => gp.isCurrentGoal == true && gp.StartDate <= today && gp.TargetQuitDate >= today)) // Filter current goals based on date
                        .ThenInclude(gp => gp.ProgressLogs) // Eager load all logs for current goal
                    .ToListAsync();

                var result = allMembers.Select(member =>
                {
                    var currentGoal = member.GoalPlans.FirstOrDefault(); // Should only be one current goal based on filtering

                    // If no current goal, return a summary indicating that
                    if (currentGoal == null)
                    {
                        return new
                        {
                            UserId = member.UserId,
                            NameDisplay = member.User?.DisplayName,
                            SmokeFreeDays = 0,
                            TotalSpentMoney = 0m,
                            LatestMood = "No active goal plan",
                            HasActiveGoal = false
                        };
                    }

                    var logs = currentGoal.ProgressLogs
                        .OrderByDescending(pl => pl.LogDate)
                        .ThenByDescending(pl => pl.CreatedAt)
                        .ToList(); // Ensure logs are ordered for latest values

                    int totalCigarettes = logs.Sum(l => l.CigarettesSmoked ?? 0);

                    // Get the most recent cigarettes per pack and price per pack from logs
                    int cigarettesPerPack = logs
                        .Where(l => l.CigarettesPerPack > 0)
                        .OrderByDescending(l => l.LogDate)
                        .FirstOrDefault()?.CigarettesPerPack ?? 20; // Default to 20 if no valid log

                    decimal pricePerPack = logs
                        .Where(l => l.PricePerPack.HasValue)
                        .OrderByDescending(l => l.LogDate)
                        .FirstOrDefault()?.PricePerPack ?? 0m; // Default to 0 if no valid log

                    decimal totalSpent = (cigarettesPerPack != 0)
                        ? Math.Round((totalCigarettes / (decimal)cigarettesPerPack) * pricePerPack, 2)
                        : 0m;

                    int smokeFreeDays = logs.Count(l => (l.CigarettesSmoked ?? 0) == 0);
                    string? latestMood = logs.FirstOrDefault()?.Mood; // Get the mood from the very latest log

                    return new
                    {
                        UserId = member.UserId,
                        NameDisplay = member.User?.DisplayName,
                        SmokeFreeDays = smokeFreeDays,
                        TotalSpentMoney = totalSpent,
                        LatestMood = latestMood,
                        HasActiveGoal = true // Indicate that they have an active goal
                    };
                }).ToList();

                return Ok(result);
            }

            return StatusCode(403, new { message = "You do not have permission to access this resource." });
        }
    }
}