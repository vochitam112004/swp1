using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.DTOs;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<Ranking> _rankingRepository;
        public RankingController(QuitSmokingSupportContext context, IGenericRepository<Ranking> rankingRepository)
        {
            _context = context;
            _rankingRepository = rankingRepository;
        }
        [HttpGet("GetRankingsMember")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<IActionResult> GetRankings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User not authenticated.");
            int userId = int.Parse(userIdClaim.Value);
            var Rankings = await _context.Rankings
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId);
            if (Rankings == null) return NotFound("Ranking not found for the user.");
            var RankingResponse = new DTORankingForRead
            {
                RankingId = Rankings.RankingId,
                UserId = Rankings.UserId,
                Level = Rankings.Level,
                Score = Rankings.Score,
                LastUpdated = Rankings.LastUpdated,
                UserName = Rankings.User?.DisplayName ?? "Unknown"
            };
            return Ok(RankingResponse);
        }
        [HttpGet("GetAllRankings")]
        [Authorize(Roles = "Admin ,Coach ,Member")]
        public async Task<ActionResult<IEnumerable<DTORankingForRead>>> GetAllRanking()
        {
            var rankings = await _context.Rankings
                .Include(r => r.User)
                .ToListAsync();
            if (rankings == null || rankings.Count == 0)
                return NotFound("No rankings found.");
            var rankingResponses = rankings.Select(r => new DTORankingForRead
            {
                RankingId = r.RankingId,
                UserId = r.UserId,
                Level = r.Level,
                Score = r.Score,
                LastUpdated = r.LastUpdated,
                UserName = r.User?.DisplayName ?? "Unknown"
            }).ToList();
            return Ok(rankingResponses);
        }
        [HttpGet("GetRankingById/{userid}")]
        [Authorize(Roles = "Admin ,Coach ,Member")]
        public async Task<IActionResult> GetRankingById(int userid)
        {
            var ranking = await _context.Rankings
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userid);
            if (ranking == null) return NotFound("Ranking not found for the user.");
            var rankingResponse = new DTORankingForRead
            {
                RankingId = ranking.RankingId,
                UserId = ranking.UserId,
                Level = ranking.Level,
                Score = ranking.Score,
                LastUpdated = ranking.LastUpdated,
                UserName = ranking.User?.DisplayName ?? "Unknown"
            };
            return Ok(rankingResponse);
        }
        [HttpGet("GetRankingByTop/{count:int?}")]
        [Authorize(Roles = "Admin ,Coach ,Member")]
        public async Task<IActionResult> GetTopRankings(int count = 10)
        {
            var topRankings = await _context.Rankings
                .Include(r => r.User)
                .OrderByDescending(r => r.Score)
                .Take(count)
                .ToListAsync();
            if (topRankings == null || topRankings.Count == 0)
                return NotFound("No rankings found.");
            var rankingResponses = topRankings.Select(r => new DTORankingForRead
            {
                RankingId = r.RankingId,
                UserId = r.UserId,
                Level = r.Level,
                Score = r.Score,
                LastUpdated = r.LastUpdated,
                UserName = r.User?.DisplayName ?? "Unknown"
            }).ToList();
            return Ok(rankingResponses);
        }
        [HttpDelete("DeleteRanking/{id}")]
        public async Task<IActionResult> DeleteRanking(int id)
        {
            var ranking = await _rankingRepository.GetByIdAsync(id);
            if (ranking == null) return NotFound("Ranking not found.");
            var result = await _rankingRepository.RemoveAsync(ranking);
            if (!result) return BadRequest("Failed to delete ranking.");
            return Ok("Ranking deleted successfully.");
        }
    }
}
