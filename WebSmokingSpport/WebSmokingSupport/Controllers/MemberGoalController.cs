using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSpport.DTOs;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberGoalController : ControllerBase
    {
        private readonly IGenericRepository<MemberGoal> _memberGoalRepository;
        public MemberGoalController(IGenericRepository<MemberGoal> memberGoalRepository)
        {
            _memberGoalRepository = memberGoalRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOMemberGoalForRead>>> GetAllMemberGoal()
        {
            var memberGoals = await _memberGoalRepository.GetAllAsync();
            if (memberGoals == null || !memberGoals.Any())
            {
                return NotFound("No member goals found.");
            }
            var MemberGoalToRead = memberGoals.Select(mg => new DTOMemberGoalForRead
            {
                MemberId = mg.MemberId,
                GoalId = mg.GoalId,
                MemberGoalId = mg.MemberGoalId,
                Status = mg.Status
            }).ToList();
            return Ok(MemberGoalToRead);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<DTOMemberGoalForRead>> GetMemberGoalById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid member goal ID.");
            }
            var memberGoal = await _memberGoalRepository.GetByIdAsync(id);
            if (memberGoal == null)
            {
                return NotFound("Member goal not found.");
            }
            var MemberGoalReponse = new DTOMemberGoalForRead
            {
                MemberId = memberGoal.MemberId,
                GoalId = memberGoal.GoalId,
                Status = memberGoal.Status,
                MemberGoalId = memberGoal.MemberGoalId
            };
            return Ok(MemberGoalReponse);
        }
        [HttpPost]
        public async Task<ActionResult<DTOMemberGoalForCreate>> CreateMemberGoal([FromBody] DTOMemberGoalForCreate memberGoalDto)
        {
            if (memberGoalDto == null)
            {
                return BadRequest("Member goal data is required.");
            }
            var newMemberGoal = new MemberGoal
            {
                MemberId = memberGoalDto.MemberId,
                GoalId = memberGoalDto.GoalId,
                Status = memberGoalDto.Status
            };
            await _memberGoalRepository.CreateAsync(newMemberGoal);
            return CreatedAtAction(nameof(GetMemberGoalById), new { id = newMemberGoal.MemberGoalId }, memberGoalDto);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<DTOMemberGoalForUpdate>> UpdateMemberGoal(int id, [FromBody] DTOMemberGoalForUpdate updateMemberGoalDto)
        {
            if (id <= 0)
            {
                return BadRequest("invalid MemberGoalID data");
            }
            var MemberGoal = await _memberGoalRepository.GetByIdAsync(id);
            if (MemberGoal == null)
            {
                return NotFound("Not found MemberGoal");
            }
            MemberGoal.MemberId = updateMemberGoalDto.MemberId;
            MemberGoal.GoalId = updateMemberGoalDto.GoalId;
            MemberGoal.Status = updateMemberGoalDto.Status;
            await _memberGoalRepository.UpdateAsync(MemberGoal);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMemberGoal(int id)
        {
            if (id <= 0)
            {
                return BadRequest("invalid MemberGoal data");
            }
            var MemberGoal = await _memberGoalRepository.GetByIdAsync(id);
            if (MemberGoal == null)
            {
                return NotFound("Not found MemberGoal");
            }
            await _memberGoalRepository.RemoveAsync(MemberGoal);
            return NoContent();
        }
    }
}
