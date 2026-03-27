
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSupport.Service;
using System.Security.Claims;
using Google.Apis.Util;
using WebSmokingSupport.Data;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberProfileController : ControllerBase
    {
        private readonly IGenericRepository<MemberProfile> _memberProfileRepository;
        private readonly QuitSmokingSupportContext _context;
        public MemberProfileController(IGenericRepository<MemberProfile> memberProfileRepository, QuitSmokingSupportContext context)
        {
            _memberProfileRepository = memberProfileRepository;
            _context = context;
        }
        [HttpGet("GetMemberProfileByUserId/{userId}")]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult<DTOMemberProfileForRead>> GetMemberProfileByUserId(int userId)
        {
            var memberProfile = await _context.MemberProfiles
                .Include(mp => mp.User)
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound($"Member profile not found for the specified user ID = {userId}.");
            }
            var MemberProfileResponse = new DTOMemberProfileForRead
            {
                MemberId = memberProfile.MemberId,
                UserId = memberProfile.UserId,
                DisplayName = memberProfile.User.DisplayName,
                CigarettesSmoked = memberProfile.CigarettesSmoked,
                QuitAttempts = memberProfile.QuitAttempts,
                ExperienceLevel = memberProfile.ExperienceLevel,
                PersonalMotivation = memberProfile.PersonalMotivation,
                health = memberProfile.health,
                PricePerPack = memberProfile.PricePerPack,
                CigarettesPerPack = memberProfile.CigarettesPerPack,
                CreatedAt = memberProfile.CreatedAt,
                UpdatedAt = memberProfile.UpdatedAt
            };
            return Ok(MemberProfileResponse);
        }
        [HttpGet("GetMyMemberProfile")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOMemberProfileForRead>> GetMyMemberProfile()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaims == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClaims);
            var memberProfile = await _context.MemberProfiles
                .Include(mp => mp.User)
                .FirstOrDefaultAsync(mp => mp.UserId == userId);

            if (memberProfile == null)
            {
                return NotFound("Member profile not found.");
            }
            var MemberProfileResponse = new DTOMemberProfileForRead
            {
                MemberId = memberProfile.MemberId,
                UserId = memberProfile.UserId,
                DisplayName = memberProfile.User.DisplayName,
                CigarettesSmoked = memberProfile.CigarettesSmoked,
                QuitAttempts = memberProfile.QuitAttempts,
                ExperienceLevel = memberProfile.ExperienceLevel,
                PersonalMotivation = memberProfile.PersonalMotivation,
                health = memberProfile.health,
                PricePerPack = memberProfile.PricePerPack,
                CigarettesPerPack = memberProfile.CigarettesPerPack,
                CreatedAt = memberProfile.CreatedAt,
                UpdatedAt = memberProfile.UpdatedAt
            };
            return Ok(MemberProfileResponse);
        }
        [HttpPost("CreateMyMemberProfile")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOMemberProfileForRead>> CreateMyMemberProfile([FromBody] DTOMemberProfileForCreate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfilExist = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfilExist != null)
            {
                return BadRequest("Member profile already exists for this user.");
            }
            var newMemberProfile = new MemberProfile
            {
                UserId = userId,
                CigarettesSmoked = dto.CigarettesSmoked,
                QuitAttempts = dto.QuitAttempts,
                ExperienceLevel = dto.ExperienceLevel,
                PersonalMotivation = dto.PersonalMotivation,
                health = dto.health,
                PricePerPack = dto.PricePerPack,
                CigarettesPerPack = dto.CigarettesPerPack,
                CreatedAt = DateTime.UtcNow,
            };
            await _memberProfileRepository.CreateAsync(newMemberProfile);
            await _context.SaveChangesAsync();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var MemberProfileResponse = new DTOMemberProfileForRead
            {
                MemberId = newMemberProfile.MemberId,
                UserId = newMemberProfile.UserId,
                DisplayName = user?.DisplayName ?? "Unknown User",
                CigarettesSmoked = newMemberProfile.CigarettesSmoked,
                QuitAttempts = newMemberProfile.QuitAttempts,
                ExperienceLevel = newMemberProfile.ExperienceLevel,
                PersonalMotivation = newMemberProfile.PersonalMotivation,
                health = newMemberProfile.health,
                PricePerPack = newMemberProfile.PricePerPack,
                CigarettesPerPack = newMemberProfile.CigarettesPerPack,
                CreatedAt = newMemberProfile.CreatedAt,
            };
            return Ok(MemberProfileResponse);
        }
        [HttpPut("UpdateMyMemberProfile")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<DTOAppointmentForRead>> UpdateMyMemberProfile([FromBody] DTOMemberProfileForUpdate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfile = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound("Member profile not found.");
            }
            memberProfile.CigarettesSmoked = dto.CigarettesSmoked ?? memberProfile.CigarettesSmoked;
            memberProfile.QuitAttempts = dto.QuitAttempts ?? memberProfile.QuitAttempts;
            memberProfile.ExperienceLevel = dto.ExperienceLevel ?? memberProfile.ExperienceLevel;
            memberProfile.PersonalMotivation = dto.PersonalMotivation ?? memberProfile.PersonalMotivation;
            memberProfile.health = dto.health ?? memberProfile.health;
            memberProfile.PricePerPack = dto.PricePerPack ?? memberProfile.PricePerPack;
            memberProfile.CigarettesPerPack = dto.CigarettesPerPack ?? memberProfile.CigarettesPerPack;
            memberProfile.UpdatedAt = DateTime.UtcNow;
            _context.MemberProfiles.Update(memberProfile);
            await _context.SaveChangesAsync();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var UpdateMemberProfileResponse = new DTOMemberProfileForRead
            {
                MemberId = memberProfile.MemberId,
                UserId = memberProfile.UserId,
                DisplayName = user.DisplayName,
                CigarettesSmoked = memberProfile.CigarettesSmoked,
                QuitAttempts = memberProfile.QuitAttempts,
                ExperienceLevel = memberProfile.ExperienceLevel,
                PersonalMotivation = memberProfile.PersonalMotivation,
                health = memberProfile.health,
                PricePerPack = memberProfile.PricePerPack,
                CigarettesPerPack = memberProfile.CigarettesPerPack,
                CreatedAt = memberProfile.CreatedAt,
                UpdatedAt = memberProfile.UpdatedAt
            };
            return Ok(UpdateMemberProfileResponse);
        }
        [HttpDelete("DeleteMyMemberProfile")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult> DeleteMyMemberProfile()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaims, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var memberProfile = await _context.MemberProfiles
                .FirstOrDefaultAsync(mp => mp.UserId == userId);
            if (memberProfile == null)
            {
                return NotFound("Member profile not found.");
            }
            _context.MemberProfiles.Remove(memberProfile);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
