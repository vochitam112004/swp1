using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSupport.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Client;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberProfileController : ControllerBase
    {
        private readonly IGenericRepository<MemberProfile> _memberProfileRepository;
        private readonly IGenericRepository<User> _userRepository;
        public MemberProfileController(IGenericRepository<MemberProfile> memberProfileRepository, IGenericRepository<User> userRepository)
        {
            _memberProfileRepository = memberProfileRepository;
            _userRepository = userRepository;
        }
        [HttpGet]
        [Authorize(Roles = "Member ,Coach,Admin")]
        public async Task<ActionResult<DTOMemberProfileForRead>> GetMemberProfile()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfile = (await _memberProfileRepository.GetAllAsync()).FirstOrDefault(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound("Member profile not found.");
            }
            var memberProfileResponse = new DTOMemberProfileForRead
            {
                MemberId = memberProfile.MemberId,
                SmokingStatus = memberProfile.SmokingStatus,
                QuitAttempts = memberProfile.QuitAttempts,
                experience_level = memberProfile.ExperienceLevel,
                PreviousAttempts = memberProfile.PreviousAttempts,
            };
            return Ok(memberProfileResponse);
        }
        [HttpPost]
        [Authorize(Roles = "Member ,Coach,Admin")]
        public async Task<ActionResult<DTOMemberProfileForCreate>> CreateMemberProfile([FromBody] DTOMemberProfileForCreate memberProfileDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.Parse(userIdString);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("User not authenticated.");
            }

            if (memberProfileDto == null)
            {
                return BadRequest("Member profile data is required.");
            }
            var userExists = await _userRepository.GetByIdAsync(userId);
            if (userExists == null)
            {
                return NotFound("User not found.");
            }
            var existingMemberProfile = (await _memberProfileRepository.GetAllAsync())
                .FirstOrDefault(mp => mp.UserId == userId);
            if (existingMemberProfile != null)
            {
                return Conflict($"User with ID already has a member profile (MemberId: {existingMemberProfile.MemberId}).");
            }
            var newMemberProfile = new MemberProfile
            {
                UserId = userId,
                SmokingStatus = memberProfileDto.SmokingStatus,
                QuitAttempts = memberProfileDto.QuitAttempts,
                ExperienceLevel = memberProfileDto.experience_level,
                PreviousAttempts = memberProfileDto.PreviousAttempts,
            };
            await _memberProfileRepository.CreateAsync(newMemberProfile);
            return Ok(new { message = "Member profile created successfully." });

        }
        [HttpPut("Update-MemberProfile/{memberId}")]
        [Authorize(Roles = "Member ,Coach,Admin")]
        public async Task<IActionResult> UpdateMemberProfile(int memberId ,[FromBody] DTOMemberProfileForUpdate memberProfileDto)
        {
           
            var existingMemberProfile = await _memberProfileRepository.GetByIdAsync(memberId);
            if (existingMemberProfile == null)
            {
                return NotFound("Member profile not found.");
            }
            if (!string.IsNullOrWhiteSpace(memberProfileDto.SmokingStatus))
            {
                existingMemberProfile.SmokingStatus = memberProfileDto.SmokingStatus;
            }
            if(!string.IsNullOrWhiteSpace(memberProfileDto.PreviousAttempts))
            {
                existingMemberProfile.PreviousAttempts = memberProfileDto.PreviousAttempts;
            }
            if(memberProfileDto.QuitAttempts.HasValue)
            {
                existingMemberProfile.QuitAttempts = memberProfileDto.QuitAttempts.Value;
            }
            if(memberProfileDto.experience_level.HasValue)
            {
                existingMemberProfile.ExperienceLevel = memberProfileDto.experience_level.Value;
            }


            await _memberProfileRepository.UpdateAsync(existingMemberProfile);
            return NoContent();
        }
        [HttpDelete()]
        [Authorize(Roles = "Member ,Coach,Admin")]
        public async Task<IActionResult> DeleteMemberProfile()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userid = int.Parse(userIdString);
            var memberProfile = (await _memberProfileRepository.GetAllAsync())
                .FirstOrDefault(mp => mp.UserId == userid);

            if (memberProfile == null)
            {
                return NotFound("Member profile not found for the logged-in user");
            }
            await _memberProfileRepository.RemoveAsync(memberProfile);
            return NoContent();
        }
    }
}
