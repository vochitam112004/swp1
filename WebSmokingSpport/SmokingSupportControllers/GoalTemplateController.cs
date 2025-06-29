using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSpport.Models;

namespace WebSmokingSpport.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalTemplateController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public GoalTemplateController(QuitSmokingSupportContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.GoalTemplates.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.GoalTemplates.FindAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(GoalTemplate obj)
        {
            _context.GoalTemplates.Add(obj);
            await _context.SaveChangesAsync();
            return Ok(obj);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GoalTemplate obj)
        {
            if (id != obj.GoalTemplateId) return BadRequest();

            _context.Entry(obj).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var obj = await _context.GoalTemplates.FindAsync(id);
            if (obj == null) return NotFound();

            _context.GoalTemplates.Remove(obj);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
