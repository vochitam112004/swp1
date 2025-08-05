using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchievementTemplateController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        public AchievementTemplateController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Coach, Admin, Member")]
        public async Task<ActionResult<IEnumerable<AchievementTemplate>>> GetAll()
        {
            return await _context.AchievementTemplates.ToListAsync();
        }
        [HttpPost]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult> Create(AchievementTemplateDTO dto)
        {
            var template = new AchievementTemplate
            {
                Name = dto.Name,
                RequiredSmokeFreeDays = dto.RequiredSmokeFreeDays,
                Description = dto.Description
            };
            _context.AchievementTemplates.Add(template);
            await _context.SaveChangesAsync();
            return Ok(template);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult> Update(int id, AchievementTemplateDTO dto)
        {
            var template = await _context.AchievementTemplates.FindAsync(id);
            if (template == null) return NotFound();

            template.Name = dto.Name;
            template.RequiredSmokeFreeDays = dto.RequiredSmokeFreeDays;
            template.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok(template);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            var template = await _context.AchievementTemplates.FindAsync(id);
            if (template == null) return NotFound();

            _context.AchievementTemplates.Remove(template);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
