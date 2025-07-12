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
        [HttpGet("GetProgress-logs")]
        [Authorize(Roles = "Member ,Coach,Admin")]
        public async Task<IActionResult> GetProgressLogs()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User not authenticated.");
            int userId = int.Parse(userIdClaim.Value);
            var member = await _context.MemberProfiles
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null) return BadRequest("Member not found");

            var logs = await _context.ProgressLogs
                .Where(p => p.MemberId == member.MemberId)
                .OrderByDescending(p => p.LogDate)
                .Select(p => new DTOProgressLogForRead
                {
                    LogId = p.LogId,
                    ProgressLogMemberName = member.User.DisplayName ?? "Unknow",
                    MemberId = p.MemberId,
                    CigarettesSmoked = p.CigarettesSmoked,
                    PricePerPack = p.PricePerPack,
                    Mood = p.Mood,
                    LogDate = p.LogDate,
                    Notes = p.Notes,
                    CigarettesPerPack = p.CigarettesPerPack,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return Ok(logs);
        }

        [HttpPost("CreateProgress-log")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CreateProgressLog([FromBody] DTOProgressLogForCreate dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null) return BadRequest("Member profile not found.");

            int memberId = member.MemberId;

            var today = DateOnly.FromDateTime(DateTime.Today);
            var goalPlan = await _context.GoalPlans
                    .Where(g =>
                        g.MemberId == memberId &&
                        g.isCurrentGoal == true &&
                        g.StartDate <= today &&
                        g.TargetQuitDate >= today)
                    .OrderByDescending(g => g.StartDate)
                    .FirstOrDefaultAsync();
            if (goalPlan == null) return BadRequest("No active goal plan found for this period.");

            var log = new ProgressLog
            {
                MemberId = memberId,
                CigarettesSmoked = dto.CigarettesSmoked,
                PricePerPack = dto.PricePerPack,
                Mood = dto.Mood,
                LogDate = dto.LogDate,
                GoalPlanId = goalPlan.PlanId,
                Notes = dto.Notes,
                CigarettesPerPack = dto.CigarettesPerPack,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            try
            {
                _context.ProgressLogs.Add(log);
                await _context.SaveChangesAsync();
                return Ok("Progress log created.");
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                if (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 2601)
                {
                    return Conflict("A progress log already exists for this date.");
                }
                throw;
            }
        }
        [HttpPut("UpdateProgress-log")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> UpdateProgressLogByDate([FromBody] DTOProgressLogForUpdate dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var member = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null) return NotFound("Member not found");

         


            // 1. Tìm GoalPlan đang hoạt động vào ngày được chọn
            // 1. Tìm GoalPlan đang hoạt động vào ngày được chọn
            var logDateOnly = DateOnly.FromDateTime(dto.LogDate.ToDateTime(TimeOnly.MinValue)); // chuyển DateTime -> DateOnly

            var currentGoalPlan = await _context.GoalPlans
                .FirstOrDefaultAsync(g =>
                    g.MemberId == member.MemberId &&
                    g.isCurrentGoal == true &&
                    g.StartDate.HasValue && g.TargetQuitDate.HasValue &&
                    g.StartDate.Value <= logDateOnly &&
                    g.TargetQuitDate.Value >= logDateOnly
                );


            if (currentGoalPlan == null)
            {
                return BadRequest("Không có GoalPlan đang hoạt động trong ngày được chọn.");
            }

            // 2. Tìm ProgressLog theo ngày đó
            var progressLog = await _context.ProgressLogs
                .FirstOrDefaultAsync(p =>
                    p.MemberId == member.MemberId &&
                    p.LogDate == logDateOnly &&
                    p.GoalPlanId == currentGoalPlan.PlanId);

            if (progressLog == null)
            {
                return NotFound("Bạn chưa tạo ProgressLog cho ngày này.");
            }

            // 3. Đảm bảo ProgressLog này thuộc đúng GoalPlan đang hoạt động
            if (progressLog.GoalPlanId != currentGoalPlan.PlanId)
            {
                return BadRequest("ProgressLog này không thuộc GoalPlan hiện tại.");
            }



            if (dto.CigarettesSmoked < 0)
            {
                return BadRequest("Số thuốc lá đã hút không thể nhỏ hơn 0.");
            }
            else
            {
                if(!string.IsNullOrWhiteSpace(dto.CigarettesSmoked.ToString()))
                {
                    progressLog.CigarettesSmoked = dto.CigarettesSmoked;
                }
            }
            if (dto.PricePerPack < 0)
            {
                return BadRequest("Giá mỗi gói thuốc lá không thể nhỏ hơn 0.");
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(dto.PricePerPack.ToString()))
                {
                    progressLog.PricePerPack = dto.PricePerPack;
                }
            }
            if (!string.IsNullOrWhiteSpace(dto.Mood))
            {
                progressLog.Mood = dto.Mood;
            }
            if (!string.IsNullOrWhiteSpace(dto.Notes))
            {
                progressLog.Notes = dto.Notes;
            }
            if (dto.CigarettesPerPack <= 0)
            {
                return BadRequest("Số thuốc lá trong mỗi gói không thể nhỏ hơn hoặc bằng 0.");
            }
            else
            {
                progressLog.CigarettesPerPack = dto.CigarettesPerPack ?? 20;
            }
            progressLog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("ProgressLog đã được cập nhật theo ngày thành công.");
        }

        [HttpDelete("DeleteByIdProgress-log/{logId}")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<IActionResult> DeleteProgressLog(int logId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);
            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null) return NotFound("Member not found");
            var progressLog = await _context.ProgressLogs
                .FirstOrDefaultAsync(p => p.LogId == logId && p.MemberId == member.MemberId);
            if (progressLog == null) return NotFound("Progress log not found");
            _context.ProgressLogs.Remove(progressLog);
            await _context.SaveChangesAsync();
            return Ok("Progress log deleted successfully.");
        }
    }
}
