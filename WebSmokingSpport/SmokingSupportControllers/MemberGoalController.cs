using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSpport.Models;

namespace WebSmokingSpport.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemberGoalController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public MemberGoalController(QuitSmokingSupportContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.MemberGoals.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.MemberGoals.FindAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(MemberGoal obj)
        {
            _context.MemberGoals.Add(obj);
            await _context.SaveChangesAsync();
            return Ok(obj);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MemberGoal obj)
        {
            if (id != obj.MemberGoalId) return BadRequest();

            _context.Entry(obj).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var obj = await _context.MemberGoals.FindAsync(id);
            if (obj == null) return NotFound();

            _context.MemberGoals.Remove(obj);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
