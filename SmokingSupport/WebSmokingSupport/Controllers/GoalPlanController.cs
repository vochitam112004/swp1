using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using WebSmokingSupport.Data;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Migrations;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GoalPlanController : ControllerBase
    {
        private readonly IGenericRepository<GoalPlan> _goalPlanRepository;
        private readonly QuitSmokingSupportContext _context;
        public GoalPlanController(IGenericRepository<GoalPlan> goalPlanRepository, QuitSmokingSupportContext context)
        {
            _context = context;
            _goalPlanRepository = goalPlanRepository;
        }
        [HttpGet("current-goal")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<ActionResult<DTOGoalPlanForRead>> GetCurrentGoal()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var member = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == int.Parse(userId));
            if (member == null) return NotFound("Member not found");

            var currentGoal = await _context.GoalPlans
                .Where(g => g.MemberId == member.MemberId && g.isCurrentGoal == true)
                .FirstOrDefaultAsync();

            if (currentGoal == null)
                return NotFound("No current goal found");

            var response = new DTOGoalPlanForRead
            {
                PlanId = currentGoal.PlanId,
                MemberId = member.MemberId,
                MemberName = member.User?.DisplayName ?? "Unknown User",
                StartDate = currentGoal.StartDate,
                TargetQuitDate = currentGoal.TargetQuitDate,

                isCurrentGoal = currentGoal.isCurrentGoal,
                PersonalMotivation = currentGoal.PersonalMotivation,
                
            };

            return Ok(response);
        }
        [HttpGet("all-goals")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<IEnumerable<DTOGoalPlanForRead>>> GetAllGoals()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var member = await _context.MemberProfiles.FirstOrDefaultAsync(m => m.UserId == int.Parse(userId));
            if (member == null) return NotFound("Member not found");

            var goals = await _context.GoalPlans
                .Where(g => g.MemberId == member.MemberId)
                .OrderByDescending(g => g.StartDate)
                .ToListAsync();

            var response = goals.Select(g => new DTOGoalPlanForRead
            {
                PlanId = g.PlanId,
                MemberId = member.MemberId,
                MemberName = member.User?.DisplayName,
                StartDate = g.StartDate,
                TargetQuitDate = g.TargetQuitDate,
                isCurrentGoal = g.isCurrentGoal,
                PersonalMotivation = g.PersonalMotivation,
              
            });

            return Ok(response);
        }
        
        [HttpPost]
        [Authorize(Roles = "Member, Coach")]
        [Produces("application/json")]
        public async Task<ActionResult<DTOGoalPlanForRead>> CreateGoalPlan([FromBody] DTOGoalPlanForCreate goalPlanDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (goalPlanDto == null)
            {
                return BadRequest("Goal plan data is required.");
            }

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not authenticated.");
                }
                int userId = int.Parse(userIdClaim.Value);

                var memberProfile = await _context.MemberProfiles
                                                  .Include(mp => mp.User)
                                                  .FirstOrDefaultAsync(mp => mp.UserId == userId);

                if (memberProfile == null)
                {
                    return NotFound("Hồ sơ thành viên không tìm thấy cho người dùng đã xác thực.");
                }

                // BƯỚC QUAN TRỌNG: Đặt tất cả các GoalPlan hiện tại của Member này về isCurrentGoal = false
                var activeGoalPlans = await _context.GoalPlans
                                                    .Where(gp => gp.MemberId == memberProfile.MemberId && gp.isCurrentGoal == true)
                                                    .ToListAsync();

                foreach (var activeGoal in activeGoalPlans)
                {
                    activeGoal.isCurrentGoal = false;
                    activeGoal.UpdatedAt = DateTime.UtcNow;
                    await _goalPlanRepository.UpdateAsync(activeGoal); // Cập nhật trạng thái
                }
                // Lưu các thay đổi vào database ngay lập tức để tránh lỗi unique constraint
                await _context.SaveChangesAsync();


                // Tạo GoalPlan mới và đặt isCurrentGoal = true
                var newGoalPlan = new GoalPlan
                {
                    MemberId = memberProfile.MemberId,
                    StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
                    TargetQuitDate = goalPlanDto.TargetQuitDate,
                    PersonalMotivation = goalPlanDto.PersonalMotivation,
                   
                    isCurrentGoal = true, // Đặt là current goal
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _goalPlanRepository.CreateAsync(newGoalPlan);
                await _context.SaveChangesAsync(); // Lưu GoalPlan mới vào database

                var goalPlanResponse = new DTOGoalPlanForRead
                {
                    PlanId = newGoalPlan.PlanId,
                    MemberId = newGoalPlan.Member.MemberId,
                    MemberName = memberProfile.User?.DisplayName ?? "Unknown User",
                    StartDate = newGoalPlan.StartDate,
                    TargetQuitDate = newGoalPlan.TargetQuitDate,
                    PersonalMotivation = newGoalPlan.PersonalMotivation,
                   
                    isCurrentGoal = newGoalPlan.isCurrentGoal, 
                };

                return CreatedAtAction(nameof(GetCurrentGoal), new { /* không cần ID */ }, goalPlanResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi nội bộ máy chủ khi tạo kế hoạch mục tiêu: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Stack Trace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi tạo kế hoạch mục tiêu: {ex.Message}");
            }
        }


        [HttpPut("Update-GoalPlan")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<DTOGoalPlanForRead>> UpdateGoalPlan([FromBody] DTOGoalPlanForUpdate goalPlanDto)
        {
            if (goalPlanDto == null)
                return BadRequest("Goal plan data is required.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            int userId = int.Parse(userIdClaim.Value);

            // Lấy Member của User hiện tại
            var member = await _context.MemberProfiles
                 .Include(m => m.User)
                 .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null)
                return NotFound("Member profile not found for current user.");

            // Tìm GoalPlan theo ID, phải thuộc về thành viên này và đang là goal hiện tại
            var existingGoalPlan = await _context.GoalPlans
                .Include(g => g.Member)
                    .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(g =>
                    g.MemberId == member.MemberId &&
                    g.isCurrentGoal == true // đảm bảo đang là kế hoạch hiện tại
                );

            if (existingGoalPlan == null)
                return NotFound("Current goal plan not found or not authorized.");

            // Cập nhật các trường được phép
            if (!string.IsNullOrWhiteSpace(goalPlanDto.PersonalMotivation))
                existingGoalPlan.PersonalMotivation = goalPlanDto.PersonalMotivation;

            if (goalPlanDto.TargetQuitDate.HasValue)
                existingGoalPlan.TargetQuitDate = goalPlanDto.TargetQuitDate.Value;


            // Cho phép cập nhật trạng thái isCurrentGoal nếu truyền vào (có thể là false)
            if (goalPlanDto.isCurrentGoal.HasValue)
                existingGoalPlan.isCurrentGoal = goalPlanDto.isCurrentGoal.Value;

            await _goalPlanRepository.UpdateAsync(existingGoalPlan);

            var goalPlanResponse = new DTOGoalPlanForRead
            {
                PlanId = existingGoalPlan.PlanId,
                MemberId = existingGoalPlan.MemberId ?? 0,
                MemberName = existingGoalPlan.Member?.User?.DisplayName ?? "Unknown User",
                StartDate = existingGoalPlan.StartDate,
                TargetQuitDate = existingGoalPlan.TargetQuitDate,
                isCurrentGoal = existingGoalPlan.isCurrentGoal,
                PersonalMotivation = existingGoalPlan.PersonalMotivation,
               
            };

            return Ok(goalPlanResponse);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> DeleteGoalPlan(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (member == null)
                return BadRequest("Member not found.");

            var goalPlan = await _context.GoalPlans
                .FirstOrDefaultAsync(gp => gp.PlanId == id && gp.MemberId == member.MemberId);

            if (goalPlan == null)
                return NotFound("Goal plan not found.");

            _context.GoalPlans.Remove(goalPlan);
            await _context.SaveChangesAsync();

            return Ok("Xóa kế hoạch thành công.");
        }
    }
}