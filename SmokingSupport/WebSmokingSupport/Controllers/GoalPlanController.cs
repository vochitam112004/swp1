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
        [HttpGet("GetAllGoalPlan")]
        [Authorize(Roles = "Coach, Admin,Member")]
        public async Task<ActionResult<IEnumerable<DTOGoalPlanForRead>>> GetAllGoalPlans()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfile = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound("Member profile not found. Please create a profile before accessing goal plans.");
            }
            var goalPlans = await _context.GoalPlans
                .Include(gp => gp.Member)
                .ThenInclude(m => m.User)
                .Where(gp => gp.MemberId == memberProfile.MemberId)
                .ToListAsync();
            if (goalPlans == null || goalPlans.Count == 0)
            {
                return NotFound("No goal plans found.");
            }
            var goalPlanResponses = goalPlans.Select(gp => new DTOGoalPlanForRead
            {
                PlanId = gp.PlanId,
                MemberDisplayName = gp.Member?.User?.DisplayName ?? "Unknown",
                StartDate = gp.StartDate,
                isCurrentGoal = gp.isCurrentGoal,
                EndDate = gp.EndDate,
                CreatedAt = gp.CreatedAt,
                UpdatedAt = gp.UpdatedAt,
                TotalDays = gp.TotalDays
            }).ToList();
            return Ok(goalPlanResponses);
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
            var memberProfile = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound("Member profile not found. Please create a profile before accessing goal plans.");
            }
            var goalPlans = await _context.GoalPlans
                .Include(gp => gp.Member)
                .ThenInclude(m => m.User)
                .Where(gp => gp.MemberId == memberProfile.MemberId && gp.isCurrentGoal == true)
                .ToListAsync();
            if (goalPlans == null || goalPlans.Count == 0)
            {
                return NotFound("Bạn không có Goal Plan hiện tại nào đang hoạt động.");
            }

            var goalPlanResponses = goalPlans.Select(gp => new DTOGoalPlanForRead
            {
                PlanId = gp.PlanId,
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
        [HttpPost("CreateGoalPlan")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOGoalPlanForRead>> CreateGoalPlan([FromBody] DTOGoalPlanForCreate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var memberProfileExisted = await _context.MemberProfiles
                .Include(mp => mp.User)
                .FirstOrDefaultAsync(mp => mp.UserId == userId);

            if (memberProfileExisted == null)
            {
                return NotFound("Member profile not found. Please create a profile before creating a goal plan.");
            }

            if (dto.StartDate > dto.EndDate)
                return BadRequest("Start date cannot be after end date.");

            if (dto.StartDate < DateOnly.FromDateTime(DateTime.UtcNow))
                return BadRequest("Start date cannot be in the past.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var activeGoalPlan = await _context.GoalPlans
                    .Include(gp => gp.Member)
                    .ThenInclude(m => m.User)
                    .FirstOrDefaultAsync(gp => gp.MemberId == memberProfileExisted.MemberId && gp.isCurrentGoal);

                if (activeGoalPlan != null)
                {
                    if (activeGoalPlan.EndDate < DateOnly.FromDateTime(DateTime.UtcNow))
                    {
                        activeGoalPlan.isCurrentGoal = false;
                        _context.GoalPlans.Update(activeGoalPlan);
                    }
                    else
                    {
                        return BadRequest("You already have an active goal plan. Please delete the old plan or complete it before creating a new one.");
                    }
                }

                var newGoalPlan = new GoalPlan
                {
                    MemberId = memberProfileExisted.MemberId,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    isCurrentGoal = true,
                    TotalDays = (dto.EndDate.DayNumber - dto.StartDate.DayNumber) + 1,
                    CreatedAt = DateTime.UtcNow
                };

                await _goalPlanRepository.CreateAsync(newGoalPlan);
                var currentDate = newGoalPlan.StartDate;
                while (currentDate <= newGoalPlan.EndDate)
                {
                    var log = new ProgressLog
                    {
                        GoalPlanId = newGoalPlan.PlanId,
                        LogDate = currentDate.ToDateTime(TimeOnly.MinValue),
                        CigarettesSmoked = 0,
                        Notes = null,
                        Mood = null,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,

                    };

                    _context.ProgressLogs.Add(log);

                    currentDate = currentDate.AddDays(1);
                }
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                var goalPlanResponse = new DTOGoalPlanForRead
                {
                    PlanId = newGoalPlan.PlanId,
                    MemberDisplayName = memberProfileExisted.User?.DisplayName ?? "Unknown",
                    StartDate = newGoalPlan.StartDate,
                    EndDate = newGoalPlan.EndDate,
                    isCurrentGoal = newGoalPlan.isCurrentGoal,
                    CreatedAt = newGoalPlan.CreatedAt,
                    UpdatedAt = newGoalPlan.UpdatedAt,
                    TotalDays = newGoalPlan.TotalDays
                };

                return Ok(goalPlanResponse);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateMyGoalPlan")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOGoalPlanForRead>> UpdateGoalPlan([FromBody] DTOGoalPlanForUpdate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfileExisted = await _context.MemberProfiles
                                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfileExisted == null)
            {
                return NotFound("Member profile not found. Please create a profile before updating a goal plan.");
            }
            var activeGoalPlan = await _context.GoalPlans
                .Include(gp => gp.Member)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(gp => gp.MemberId == memberProfileExisted.MemberId && gp.isCurrentGoal == true);
            if (activeGoalPlan == null)
            {
                return NotFound("No active goal plan found for the current member.");
            }
            if (dto.StartDate > dto.EndDate)
            {
                return BadRequest("Start date cannot be after end date.");
            }
            if (dto.StartDate < DateOnly.FromDateTime(DateTime.UtcNow))
            {
                return BadRequest("Start date cannot be in the past.");
            }
            activeGoalPlan.StartDate = dto.StartDate ?? activeGoalPlan.StartDate;
            activeGoalPlan.EndDate = dto.EndDate ?? activeGoalPlan.EndDate;
            activeGoalPlan.isCurrentGoal = dto.IsCurrentGoal ?? activeGoalPlan.isCurrentGoal;
            activeGoalPlan.TotalDays = (dto.EndDate?.DayNumber - dto.StartDate?.DayNumber) + 1 ?? activeGoalPlan.TotalDays;
            activeGoalPlan.UpdatedAt = DateTime.UtcNow;
            await _goalPlanRepository.UpdateAsync(activeGoalPlan);
            await _context.SaveChangesAsync();

            var goalPlanResponse = new DTOGoalPlanForRead
            {
                PlanId = activeGoalPlan.PlanId,
                MemberDisplayName = activeGoalPlan.Member?.User?.DisplayName ?? "Unknown",
                StartDate = activeGoalPlan.StartDate,
                isCurrentGoal = activeGoalPlan.isCurrentGoal,
                EndDate = activeGoalPlan.EndDate,
                CreatedAt = activeGoalPlan.CreatedAt,
                UpdatedAt = activeGoalPlan.UpdatedAt,
                TotalDays = activeGoalPlan.TotalDays
            };
            return Ok(goalPlanResponse);
        }
        [HttpDelete("{planId}")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult> DeleteGoalPlan(int planId)
        {
            if (planId <= 0)
            {
                return BadRequest($"Invalid plan ID = {planId}.");
            }
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfileExisted = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfileExisted == null)
            {
                return NotFound("Member profile not found. Please create a profile before deleting a goal plan.");
            }
            var goalPlanExisted = await _context.GoalPlans
                .Include(gp => gp.Member)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(gp => gp.PlanId == planId && gp.MemberId == memberProfileExisted.MemberId);
            if (goalPlanExisted == null)
            {
                return NotFound($"Goal plan not found for the specified plan ID = {planId}.");
            }
            _context.GoalPlans.Remove(goalPlanExisted);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
