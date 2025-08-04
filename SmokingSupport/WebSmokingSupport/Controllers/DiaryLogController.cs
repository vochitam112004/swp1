using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiaryLogController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public DiaryLogController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDiaryLog>>> GetAllLogs()
        {
            var logs = await _context.UserDiaryLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.LogDate)
                .ToListAsync();

            return Ok(logs);
        }

        [Authorize(Roles ="Member")]
        [HttpPost]
        public async Task<IActionResult> CreateLog([FromBody] DTODiaryLogForCreate dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var log = new UserDiaryLog
            {
                UserId = userId,
                LogDate = dto.LogDate,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserDiaryLogs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(log);
        }

        [Authorize(Roles ="Member")]
        [HttpPut]
        public async Task<IActionResult> UpdateLog([FromBody] DTODiaryLogForUpdate dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var log = await _context.UserDiaryLogs.FirstOrDefaultAsync(l => l.LogId == dto.LogId);
            if (log == null) return NotFound("Log not found");
            if (log.UserId != userId) return Forbid("You cannot edit this log");

            log.Content = dto.Content;
            await _context.SaveChangesAsync();

            return Ok(log);
        }
        [Authorize(Roles ="Member")]
        [HttpDelete("{logId}")]
        public async Task<IActionResult> DeleteLog(int logId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var log = await _context.UserDiaryLogs.FirstOrDefaultAsync(l => l.LogId == logId);
            if (log == null) return NotFound("Log not found");
            if (log.UserId != userId) return Forbid("You cannot delete this log");

            _context.UserDiaryLogs.Remove(log);
            await _context.SaveChangesAsync();

            return Ok("Deleted successfully");
        }
    }
}
