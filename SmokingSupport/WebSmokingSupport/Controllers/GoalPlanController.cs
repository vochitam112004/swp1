using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Data;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSupport.DTOs;
using System.Security.Claims;
using System.Diagnostics.Contracts;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalPlanController : ControllerBase
    {
        private readonly IGenericRepository<GoalPlan> _goalPlanRepository;
        private readonly QuitSmokingSupportContext _context;
        public GoalPlanController(IGenericRepository<GoalPlan> goalPlanRepository, QuitSmokingSupportContext context)
        {
            _goalPlanRepository = goalPlanRepository;
            _context = context;
        }
        [HttpGet("GetMyCurrentGoalPlans")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOGoalPlanForRead>> GetMyCurrentGoalPlans()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var goalPlans = await _context.GoalPlans
                .Include(gp => gp.Member)
                .Where(gp => gp.MemberId == userId && gp.isCurrentGoal)
                .ToListAsync();
            if (goalPlans == null || goalPlans.Count == 0)
            {
                return NotFound("No current goal plans found for the user.");
            }
            var goalPlanResponses = goalPlans.Select(gp => new DTOGoalPlanForRead
            {
                PlanId = gp.PlanId,
                MemberId = gp.MemberId,
                MemberDisplayName = gp.Member?.User?.DisplayName ?? "Unknown",
                StartDate = gp.StartDate,
                isCurrentGoal = gp.isCurrentGoal,
                EndDate = gp.EndDate,
                CreatedAt = gp.CreatedAt,
                UpdatedAt = gp.UpdatedAt,
                TotalDays = gp.TotalDays,
            }).ToList();
            return Ok(goalPlanResponses);
        }
        [HttpGet("GetGoalPlanById/{planId}")]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult<DTOGoalPlanForRead>> GetGoalPlanById(int planId)
        {
            if(planId <= 0)
            {
                return BadRequest($"Invalid plan ID = {planId}.");
            }
            var goalPlanExisted = await _context.GoalPlans
                .Include(gp => gp.Member)
                .FirstOrDefaultAsync(gp => gp.PlanId == planId);
            if(goalPlanExisted == null)
            {
                return NotFound($"Goal plan not found for the specified plan ID = {planId}.");
            }
            var goalPlanResponse = new DTOGoalPlanForRead
            {
                PlanId = goalPlanExisted.PlanId,
                MemberDisplayName = goalPlanExisted.Member?.User?.DisplayName ?? "Unknown",
                MemberId = goalPlanExisted.MemberId,
                StartDate = goalPlanExisted.StartDate,
                isCurrentGoal = goalPlanExisted.isCurrentGoal,
                EndDate = goalPlanExisted.EndDate,
                CreatedAt = goalPlanExisted.CreatedAt,
                UpdatedAt = goalPlanExisted.UpdatedAt,
                TotalDays = goalPlanExisted.TotalDays
            };
            return Ok(goalPlanResponse);
        }
        [HttpPost("CreateGoalPlan")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOGoalPlanForRead>> CreateGoalPlan([FromBody] DTOGoalPlanForCreate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var goalPlanExsited = await _context.GoalPlans
                .Include(gp => gp.Member)
                .Where(gp => gp.isCurrentGoal == true && gp.StartDate <= gp.EndDate);
                
        }
    }
}
