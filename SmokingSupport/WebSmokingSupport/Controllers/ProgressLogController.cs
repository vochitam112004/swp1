using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSpport.DTOs;
using Microsoft.EntityFrameworkCore;
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
        public async Task<ActionResult<DTOProgressLogForRead>> GetAllProgressLog()
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
            var ProgressLogExsited  = await _context.ProgressLogs
                .Where(pl => pl.MemberId == memberProfile.MemberId)
                .OrderByDescending(pl => pl.LogDate)
                .Select(pl => new DTOProgressLogForRead
                {
                    LogId = pl.LogId,
                    MemberId = pl.MemberId,
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
                }).ToListAsync();
            if (ProgressLogExsited == null || !ProgressLogExsited.Any())
            {
                return NotFound("No progress logs found for the authenticated user.");
            }
            return Ok(ProgressLogExsited);
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
            var ProgressLogExsited = await _context.ProgressLogs
                .Where(pl => pl.MemberId == memberProfile.MemberId &&
                       DateOnly.FromDateTime(pl.LogDate) == LongDate)
                .OrderByDescending(pl => pl.LogDate)
                .Select(pl => new DTOProgressLogForRead
                {
                    LogId = pl.LogId,
                    MemberId = pl.MemberId,
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
                }).FirstOrDefaultAsync();
            if (ProgressLogExsited == null)
            {
                return NotFound($"No progress log found for the date {LongDate}.");
            }
            return Ok(ProgressLogExsited);
        }
    }
}
