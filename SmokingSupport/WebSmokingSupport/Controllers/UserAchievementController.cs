using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAchievementController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public UserAchievementController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet("{userId}")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<ActionResult<IEnumerable<UserAchievement>>> GetByUser(int userId)
        {
            var achievements = await _context.UserAchievements
                .Include(ua => ua.Template)
                .Where(ua => ua.UserId == userId)
                .ToListAsync();

            return Ok(achievements);
        }

        [HttpPost("assign")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> AssignAchievement([FromBody] AssignAchievementDTO dto)
        {
            var alreadyExists = await _context.UserAchievements
                .AnyAsync(ua => ua.UserId == dto.UserId && ua.TemplateId == dto.TemplateId);

            if (alreadyExists)
                return BadRequest("User already has this achievement.");

            var newAchievement = new UserAchievement
            {
                UserId = dto.UserId,
                TemplateId = dto.TemplateId,
                LastUpdated = DateTime.UtcNow
            };

            _context.UserAchievements.Add(newAchievement);
            await _context.SaveChangesAsync();

            return Ok(newAchievement);
        }
        [HttpDelete("{userId}/{templateId}")]
        [Authorize(Roles ="Coach,Admin")]
        public async Task<IActionResult> DeleteAchievement(int userId, int templateId)
        {
            var achievement = await _context.UserAchievements
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.TemplateId == templateId);

            if (achievement == null)
                return NotFound("Achievement not found.");

            _context.UserAchievements.Remove(achievement);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
