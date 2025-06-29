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
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GoalPlanController : ControllerBase
    {
        private readonly IGenericRepository<GoalPlan> _goalPlanRepository;
        private readonly QuitSmokingSupportContext _context;
        public GoalPlanController(IGenericRepository<GoalPlan> goalPlanRepository , QuitSmokingSupportContext context)
        {
            _context = context;
            _goalPlanRepository = goalPlanRepository;
        }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DTOGoalPlanForRead>>> GetAllGoalPlans()
        {
           var userIdClaim  = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var goalPlans = await _goalPlanRepository.GetAllAsync();
            goalPlans = goalPlans.Where(g => g.MemberId == userId).ToList();
            if (goalPlans == null || !goalPlans.Any())
            {
                return NotFound("No goal plans found for this member.");
            }
            var goalPlanResponses = goalPlans.Select(g => new DTOGoalPlanForRead
            {
               
                StartDate = g.StartDate,
                TargetQuitDate = g.TargetQuitDate,
                PersonalMotivation = g.PersonalMotivation,
                UseTemplate = g.UseTemplate,
            }).ToList();
            return Ok(goalPlanResponses);
        }
        [HttpPost]
        public async Task<ActionResult<DTOGoalPlanForCreate>> CreateGoalPlan([FromBody] DTOGoalPlanForCreate goalPlanDto)
        {
            if (goalPlanDto == null)
            {
                return BadRequest("Goal plan data is required.");
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var memberProfile = await _context.MemberProfiles
                .AsQueryable()
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound("Member profile not found for the authenticated user.");
            }
            var newGoalPlan = new GoalPlan
            {
                MemberId = memberProfile.MemberId,
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                TargetQuitDate = goalPlanDto.TargetQuitDate,
                PersonalMotivation = goalPlanDto.PersonalMotivation,
                UseTemplate = goalPlanDto.UseTemplate
            };
            await _goalPlanRepository.CreateAsync(newGoalPlan);
            var goalPlanResponse = new DTOGoalPlanForRead
            {
                StartDate = newGoalPlan.StartDate,
                TargetQuitDate = newGoalPlan.TargetQuitDate,
                PersonalMotivation = newGoalPlan.PersonalMotivation,
                UseTemplate = newGoalPlan.UseTemplate
            };
            return Ok(goalPlanResponse);
        }
        [HttpPut]
        public async Task<ActionResult<DTOGoalPlanForUpdate>> UpdateGoalPlan([FromBody] DTOGoalPlanForUpdate goalPlanDto)
        {
            if (goalPlanDto == null)
            {
                return BadRequest("Goal plan data is required.");
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var existingGoalPlan = await _goalPlanRepository.GetByIdAsync(goalPlanDto.GoalPlanId);
            if (existingGoalPlan == null || existingGoalPlan.MemberId != userId)
            {
                return NotFound("Goal plan not found or does not belong to the user.");
            }
     
            existingGoalPlan.TargetQuitDate = goalPlanDto.TargetQuitDate;
            existingGoalPlan.PersonalMotivation = goalPlanDto.PersonalMotivation;
            existingGoalPlan.UseTemplate = goalPlanDto.UseTemplate;
            await _goalPlanRepository.UpdateAsync(existingGoalPlan);
            var goalPlanResponse = new DTOGoalPlanForRead
            {
                StartDate = existingGoalPlan.StartDate,
                TargetQuitDate = existingGoalPlan.TargetQuitDate,
                PersonalMotivation = existingGoalPlan.PersonalMotivation,
                UseTemplate = existingGoalPlan.UseTemplate
            };
            return Ok(goalPlanResponse);
        }
        [HttpDelete("{goalPlanId}")]
        public async Task<IActionResult> DeleteGoalPlan(int goalPlanId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var existingGoalPlan = await _goalPlanRepository.GetByIdAsync(goalPlanId);
            if (existingGoalPlan == null || existingGoalPlan.MemberId != userId)
            {
                return NotFound("Goal plan not found or does not belong to the user.");
            }
            await _goalPlanRepository.RemoveAsync(existingGoalPlan);
            return NoContent();
        }
    }
}