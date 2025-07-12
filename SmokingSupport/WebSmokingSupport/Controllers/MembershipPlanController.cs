using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.DTOs;
using System.Collections.Generic;
using WebSmokingSupport.Entity;
using System.Security.Claims;
using WebSmokingSupport.Repositories;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipPlanController : ControllerBase
    {
        private readonly IGenericRepository<MembershipPlan> _membershipPlanRepository;

        public MembershipPlanController(IGenericRepository<MembershipPlan> membershipPlanRepository)
        {
            _membershipPlanRepository = membershipPlanRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOMembershipPlanForRead>>> GetAllMembershipPlan()
        {
            var membershipPlans = await _membershipPlanRepository.GetAllAsync();
            if (membershipPlans == null || membershipPlans.Count == 0)
            {
                return NotFound("No membership plans found.");
            }
            var membershipPlanResponses = (membershipPlans ?? new List<MembershipPlan>()).Select(mp => new DTOMembershipPlanForRead
            {
                PlanId = mp.PlanId ?? 0,
                Name = mp.Name,
                Price = mp.Price,
                DurationDays = mp.DurationDays,
                Description = mp.Description,
                CreatedAt = mp.CreatedAt,
                UpdatedAt = mp.UpdatedAt,
            }).ToList();
            return Ok(membershipPlanResponses);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateMembershipPlans([FromBody] DTOMembershipPlanForCreate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingPlans = await _membershipPlanRepository.GetAllAsync();
            var existingPlan = existingPlans.FirstOrDefault(mp => mp.Name.ToLower() == dto.Name.ToLower());
            if (existingPlan != null)
            {
                return BadRequest("Membership plan with this name already exists.");
            }
            var MembershipPlan = new MembershipPlan
            {
                Name = dto.Name,
                Price = dto.Price,
                DurationDays = dto.DurationDays,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
            };
            await _membershipPlanRepository.CreateAsync(MembershipPlan);
            return Ok(MembershipPlan);
        }
        [HttpPut("{planId}")]
        public async Task<ActionResult<DTOMembershipPlanForUpdate>> UpdateMembershipPlans(int planId ,[FromBody] DTOMembershipPlanForUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingPlan = await _membershipPlanRepository.GetAllAsync();
            var existingPlans = existingPlan.FirstOrDefault(mp => mp.PlanId == planId);

            if (existingPlans == null)
            {
                return NotFound("Membership plan not found.");
            }
           
            if(!string.IsNullOrEmpty(dto.Name))
            {
                existingPlans.Name = dto.Name;
            }
            if (!string.IsNullOrEmpty(dto.Description))
            {
                existingPlans.Description = dto.Description;
            }
            if(dto.DurationDays > 0)
            {
                existingPlans.DurationDays = dto.DurationDays;
            }
            if (dto.Price > 0)
            {
                existingPlans.Price = dto.Price;
            }
            existingPlans.UpdatedAt = DateTime.UtcNow;

            await _membershipPlanRepository.UpdateAsync(existingPlans);
            return Ok(new DTOMembershipPlanForRead
            {
                Name = existingPlans.Name,
                Price = existingPlans.Price,
                DurationDays = existingPlans.DurationDays,
                Description = existingPlans.Description,
                CreatedAt = existingPlans.CreatedAt,
                UpdatedAt = existingPlans.UpdatedAt
            });
         
        }
        [HttpDelete("{planId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteMemberships(int planId)
        {
            var existingPlan = await _membershipPlanRepository.GetByIdAsync(planId);
            if(existingPlan == null)
            {
                return NotFound($"not found MembershipPlan with ID = {planId}");
            }
            await _membershipPlanRepository.RemoveAsync(existingPlan);
            return Ok(new { message = "Membership plan deleted successfully." });
        }
    }
}