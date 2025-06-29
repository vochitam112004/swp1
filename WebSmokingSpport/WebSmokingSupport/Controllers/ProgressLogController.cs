using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X509;
using WebSmokingSpport.DTOs;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProgressLogController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<ProgressLog> _progressLogRepository;
        public ProgressLogController(QuitSmokingSupportContext context , IGenericRepository<ProgressLog> progressLogRepository)
        {
            this._context = context;
            this._progressLogRepository = progressLogRepository;
        }
        [HttpGet("progress-log")]
        public async Task<ActionResult<IEnumerable<DTOProgressLogForRead>>> GetAllProgressLog()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var progressLogs = await _progressLogRepository.GetAllAsync();
            progressLogs = progressLogs.Where(pl => pl.MemberId == userId).ToList();
            if (progressLogs == null || !progressLogs.Any())
            {
                return NotFound("No progress logs found for this member.");
            }
            var progressLogResponses = progressLogs.Select(pl => new DTOProgressLogForRead
            {
                LogDate = pl.LogDate,
                CigarettesSmoked = pl.CigarettesSmoked,
                Mood = pl.Mood,
                PricePerPack = pl.PricePerPack,
                Trigger = pl.Trigger,
                Notes = pl.Notes
            }).ToList();
            return Ok(progressLogResponses);
        }
        [HttpPost("progress-log")]
        public async Task<ActionResult<DTOProgressLogForCreate>> CreateProgressLog([FromBody] DTOProgressLogForCreate progressLog)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var memeber = await _context.MemberProfiles
                .AsQueryable()
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (memeber == null)
            {
                return NotFound("Member profile not found.");
            }
            var newProgressLog = new ProgressLog
            {
                MemberId = memeber.MemberId,
                LogDate = progressLog.LogDate,
                CigarettesSmoked = progressLog.CigarettesSmoked,
                PricePerPack = progressLog.PricePerPack,
                Mood = progressLog.Mood,
                Trigger = progressLog.Trigger,
                Notes = progressLog.Notes
            };
            if (progressLog.CigarettesSmoked < 0 || progressLog.CigarettesSmoked > 100)
            {
                return BadRequest("Cigarettes smoked must be between 0 and 100.");
            }
            await _progressLogRepository.CreateAsync(newProgressLog);
            var ProgressLogResponse = new DTOProgressLogForRead
            {
               CigarettesSmoked = newProgressLog.CigarettesSmoked,
                LogDate = newProgressLog.LogDate,
                Mood = newProgressLog.Mood,
                Trigger = newProgressLog.Trigger,
                Notes = newProgressLog.Notes,
                PricePerPack = newProgressLog.PricePerPack
            };
            return Ok(ProgressLogResponse);
        }
        [HttpPut("progress-log/{logId}")]
        public async Task<IActionResult> UpdateProgressLog(int logId, [FromBody] DTOProgressLogForUpdate rogressLogDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var progressLog = await _progressLogRepository.GetByIdAsync(logId);
            if (progressLog == null || progressLog.MemberId != userId)
            {
                return NotFound("Progress log not found or does not belong to the authenticated user.");
            }
            progressLog.LogDate = rogressLogDto.LogDate;
            progressLog.CigarettesSmoked = rogressLogDto.CigarettesSmoked;
            progressLog.Mood = rogressLogDto.Mood;
            progressLog.PricePerPack = rogressLogDto.PricePerPack;
            progressLog.Trigger = rogressLogDto.Trigger;
            progressLog.Notes = rogressLogDto.Notes;
            await _progressLogRepository.UpdateAsync(progressLog);
            return NoContent();
        }
        [HttpDelete("progress-log/{logId}")]
        public async Task<IActionResult> DeleteProgressLog(int logId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var progressLog = await _progressLogRepository.GetByIdAsync(logId);
            if (progressLog == null || progressLog.MemberId != userId)
            {
                return NotFound("Progress log not found or does not belong to the authenticated user.");
            }
            await _progressLogRepository.RemoveAsync(progressLog);
            return NoContent();
        }
    }
}
