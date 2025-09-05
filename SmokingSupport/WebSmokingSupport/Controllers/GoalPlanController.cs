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
using WebSmokingSpport.DTOs;
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
                UserId = gp.Member?.UserId ?? 0,
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
                return NotFound("Bạn khô có Goal Plan hiện tại nào đang hoạt động.");
            }

            var goalPlanResponses = goalPlans.Select(gp => new DTOGoalPlanForRead
            {
                PlanId = gp.PlanId,
                UserId = gp.Member?.UserId ?? 0,
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
                    UserId= userId,
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
        [HttpGet("GetHistoryGoalPlan/{planId}")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<DTOGoalPlanForRead>> GetHistoryGoalPlan(int planId)
        {
            if (planId <= 0)
            {
                return BadRequest("Invalid plan ID.");
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
                return NotFound("Member profile not found. Please create a profile before accessing goal plans.");
            }
            var goalPlan = await _context.GoalPlans
                .Include(gp => gp.Member)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(gp => gp.PlanId == planId && gp.MemberId == memberProfileExisted.MemberId && !gp.isCurrentGoal);
            if (goalPlan == null)
            {
                return NotFound("Historical goal plan not found for the specified plan ID.");
            }
            var memberName = goalPlan.Member?.User?.DisplayName ?? "Unknown";
            var progressLog = await _context.ProgressLogs
                .Where(pl => pl.GoalPlanId == goalPlan.PlanId)
                .OrderByDescending(pl => pl.LogDate)
                .Select(pl => new DTOProgressLogForRead
                {
                    LogId = pl.LogId,
                    MemberId = goalPlan.MemberId,
                    ProgressLogMemberName = memberName,
                    Notes = pl.Notes,
                    Mood = pl.Mood,
                    Triggers = pl.Triggers,
                    Symptoms = pl.Symptoms,
                    GoalPlanId = pl.GoalPlanId,
                    LogDate = pl.LogDate,
                    CigarettesSmoked = pl.CigarettesSmoked,
                    CreatedAt = pl.CreatedAt,
                    UpdatedAt = pl.UpdatedAt
                })
                .ToListAsync();
            if (progressLog == null || progressLog.Count == 0)
            {
                return NotFound("No progress logs found for the specified goal plan.");
            }
            var goalPlanResponse = new DTOGoalPlanForRead
            {
                PlanId = goalPlan.PlanId,
                UserId = goalPlan.Member?.UserId ?? 0,
                MemberDisplayName = goalPlan.Member?.User?.DisplayName ?? "Unknown",
                StartDate = goalPlan.StartDate,
                isCurrentGoal = goalPlan.isCurrentGoal,
                EndDate = goalPlan.EndDate,
                CreatedAt = goalPlan.CreatedAt,
                UpdatedAt = goalPlan.UpdatedAt,
                TotalDays = goalPlan.TotalDays,
            };
            return Ok(new { GoalPlan = goalPlanResponse, ProgressLogs = progressLog });
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
                .FirstOrDefaultAsync(gp => gp.MemberId == memberProfileExisted.MemberId && gp.isCurrentGoal);
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

            var oldEndDate = activeGoalPlan.EndDate;
            var newEndDate = dto.EndDate ?? activeGoalPlan.EndDate;

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                activeGoalPlan.EndDate = newEndDate;
                activeGoalPlan.isCurrentGoal = dto.IsCurrentGoal ?? activeGoalPlan.isCurrentGoal;
                activeGoalPlan.TotalDays = (newEndDate.DayNumber - activeGoalPlan.StartDate.DayNumber) + 1;
                activeGoalPlan.UpdatedAt = DateTime.UtcNow;

                await _goalPlanRepository.UpdateAsync(activeGoalPlan);

                // Nếu tăng ngày -> tạo thêm ProgressLog
                if (newEndDate > oldEndDate)
                {
                    var date = oldEndDate.AddDays(1);
                    while (date <= newEndDate)
                    {
                        var log = new ProgressLog
                        {
                            GoalPlanId = activeGoalPlan.PlanId,
                            LogDate = date.ToDateTime(TimeOnly.MinValue),
                            CigarettesSmoked = 0,
                            Notes = null,
                            Mood = null,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                        };
                        _context.ProgressLogs.Add(log);
                        date = date.AddDays(1);
                    }
                }
                // Nếu giảm ngày -> xóa các ProgressLog sau EndDate mới
                else if (newEndDate < oldEndDate)
                {
                    var logsToRemove = await _context.ProgressLogs
                        .Where(pl => pl.GoalPlanId == activeGoalPlan.PlanId && pl.LogDate > newEndDate.ToDateTime(TimeOnly.MinValue))
                        .ToListAsync();

                    _context.ProgressLogs.RemoveRange(logsToRemove);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var goalPlanResponse = new DTOGoalPlanForRead
                {
                    PlanId = activeGoalPlan.PlanId,
                    UserId = activeGoalPlan.Member?.UserId ?? 0,
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
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{planId}")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult> DeleteGoalPlan(int planId)
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
                return NotFound("Member profile not found. Please create a profile before deleting a goal plan.");
            }
            var goalPlan = await _context.GoalPlans
                .Include(gp => gp.Member)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(gp => gp.PlanId == planId && gp.MemberId == memberProfileExisted.MemberId);
            if (goalPlan == null)
            {
                return NotFound("Goal plan not found.");
            }
            goalPlan.isCurrentGoal = false;
            _context.GoalPlans.Remove(goalPlan);
            await _context.SaveChangesAsync();
            return NoContent();
        }   
    }
}
