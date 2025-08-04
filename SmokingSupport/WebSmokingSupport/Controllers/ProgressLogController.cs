using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSpport.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop.Infrastructure;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressLogController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<ProgressLog> _progressLogRepository;
        public ProgressLogController(QuitSmokingSupportContext context, IGenericRepository<ProgressLog> progressLogRepository)
        {
            _context = context;
            _progressLogRepository = progressLogRepository;
        }
        [HttpGet("GetMyAllProgressLog")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<IEnumerable<DTOProgressLogForRead>>> GetAllProgressLog()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaims == null)
            {
                return Unauthorized("User not authenticated.");
            }

            int userId = int.Parse(userIdClaims);
            var memberProfile = await _context.MemberProfiles
                .Include(mp => mp.User)
                .FirstOrDefaultAsync(mp => mp.UserId == userId);

            if (memberProfile == null)
            {
                return NotFound("Member profile not found for the authenticated user.");
            }

            var goalPlanIds = await _context.GoalPlans
                .Where(gp => gp.MemberId == memberProfile.MemberId)
                .Select(gp => gp.PlanId)
                .ToListAsync();

            if (goalPlanIds == null || !goalPlanIds.Any())
            {
                return NotFound("No goal plans found for the authenticated user.");
            }

            var progressLogs = await _context.ProgressLogs
                .Where(pl => pl.GoalPlanId != null && goalPlanIds.Contains(pl.GoalPlanId))
                .OrderByDescending(pl => pl.LogDate)
                .Select(pl => new DTOProgressLogForRead
                {
                    LogId = pl.LogId,
                    MemberId = memberProfile.MemberId,
                    ProgressLogMemberName = memberProfile.User.DisplayName,
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

            if (progressLogs == null || !progressLogs.Any())
            {
                return NotFound("No progress logs found for the authenticated user.");
            }

            return Ok(progressLogs);
        }
        [HttpGet("GetProgressLogByDate/{LongDate}")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOProgressLogForRead>> GetProgressLogByDate(DateOnly LongDate)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaims == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaims);

            var memberProfile = await _context.MemberProfiles
                .Include(mp => mp.User)
                .FirstOrDefaultAsync(mp => mp.UserId == userId);

            if (memberProfile == null)
            {
                return NotFound("Member profile not found for the authenticated user.");
            }
            // Lấy danh sách GoalPlanId thuộc về member này
            var goalPlanIds = await _context.GoalPlans
                .Where(gp => gp.MemberId == memberProfile.MemberId)
                .Select(gp => gp.PlanId)
                .ToListAsync();

            if (!goalPlanIds.Any())
            {
                return NotFound("No goal plans found for the authenticated user.");
            }

            var targetDate = LongDate.ToDateTime(TimeOnly.MinValue);

            var progressLog = await _context.ProgressLogs
                .Where(pl => pl.LogDate.Date == targetDate.Date && pl.GoalPlanId != null && goalPlanIds.Contains(pl.GoalPlanId))
                .OrderByDescending(pl => pl.LogDate)
                .Select(pl => new DTOProgressLogForRead
                {
                    LogId = pl.LogId,
                    MemberId = memberProfile.MemberId,
                    ProgressLogMemberName = memberProfile.User.DisplayName,
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
                .FirstOrDefaultAsync();

            if (progressLog == null)
            {
                return NotFound($"No progress log found for the date {LongDate}.");
            }

            return Ok(progressLog);
        }

        [HttpPut("UpdateProgressLogByDate")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOProgressLogForRead>> UpdateProgressLogByDate([FromBody] DTOProgressLogForUpdate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaims == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaims);
            var memberProfile = await _context.MemberProfiles
                .Include(mp => mp.User)
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if(memberProfile == null)
            {
                return NotFound("Member profile not found for the authenticated user.");
            }
            var goalPlanIds = await _context.GoalPlans
                .Where(gp => gp.MemberId == memberProfile.MemberId)
                .Select(gp => gp.PlanId)
                .ToListAsync();

            if (!goalPlanIds.Any())
            {
                return NotFound("No goal plans found for the authenticated user.");
            }
            var logDate = dto.LogDate.ToDateTime(new TimeOnly(0, 0));
            var progressLog = await _context.ProgressLogs
                        .FirstOrDefaultAsync(pl =>
                            pl.GoalPlanId != null && goalPlanIds.Contains(pl.GoalPlanId) && pl.LogDate.Date == logDate.Date);
            if (progressLog == null)
            {
                return NotFound($"No progress log found for the date {dto.LogDate} , tạo goalPlan để có ProgressLog đc tự độg tạo ra ở GoalPlan");
            }
            progressLog.Notes = dto.Notes ?? progressLog.Notes;
            progressLog.Mood = dto.Mood ?? progressLog.Mood;
            progressLog.Triggers = dto.Triggers ?? progressLog.Triggers;
            progressLog.Symptoms = dto.Symptoms ?? progressLog.Symptoms;
            progressLog.CigarettesSmoked = dto.CigarettesSmoked ?? progressLog.CigarettesSmoked;
            progressLog.UpdatedAt = DateTime.UtcNow;
            _context.ProgressLogs.Update(progressLog);
            await _context.SaveChangesAsync();
            var updatedProgressLog = new DTOProgressLogForRead
            {
                LogId = progressLog.LogId,
                ProgressLogMemberName = memberProfile.User.DisplayName,
                Notes = progressLog.Notes,
                Mood = progressLog.Mood,
                Triggers = progressLog.Triggers,
                Symptoms = progressLog.Symptoms,
                GoalPlanId = progressLog.GoalPlanId,
                LogDate = progressLog.LogDate,
                CigarettesSmoked = progressLog.CigarettesSmoked,
                CreatedAt = progressLog.CreatedAt,
                UpdatedAt = progressLog.UpdatedAt
            };
            return Ok(updatedProgressLog);
        }
    }
}
