using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommunityInteractionController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<CommunityInteraction> _communityInteractionRepository;
        public CommunityInteractionController(QuitSmokingSupportContext context, IGenericRepository<CommunityInteraction> communityInteractionRepository)
        {
            _context = context;
            _communityInteractionRepository = communityInteractionRepository;
        }
        [HttpGet("getAllCommmentPost/{PostId}")]
        public async Task<ActionResult<IEnumerable<DTOCommunityInteractionForRead>>>GetAllCommunityInteractionInPost(int PostId)
        {
            var comments = await _context.CommunityInteractions
                .Where(i => i.PostId == PostId)
                .OrderByDescending(i => i.CommentedAt)
                .Select(i => new DTOCommunityInteractionForRead
                {
                    PostId = i.PostId ?? 0,
                    InteractionId = i.InteractionId,
                    UserId = i.UserId,
                    CommentedAt = i.CommentedAt,
                    EditedAt = i.EditedAt,
                    isEdit = i.isEdit,
                    CommentContent = i.CommentContent
                }).ToListAsync();
            return Ok(comments);
        }
        [HttpPost("Create-Comment")]
        [Authorize(Roles ="Coach,Admin,Member")]
        public async Task<ActionResult<DTOCommunityInteractionForRead>> CreateCommunityInteraction([FromBody] DTOCommunityInteractionForCreate dto)
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim))
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(currentUserIdClaim);
             var post = await _context.CommunityPosts.FindAsync(dto.PostId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }

                var newCommunityInteraction = new CommunityInteraction
            {
                PostId =dto.PostId,
                UserId = userId,
                CommentContent = dto.CommentContent,
                CommentedAt = DateTime.UtcNow,
                isEdit = false
            };
            await _communityInteractionRepository.CreateAsync(newCommunityInteraction);
            return Ok("comment created");
        }
        [HttpPut("UpdateComment/{id}")]
        [Authorize(Roles = "Admin, Member, Coach")]
        public async Task<ActionResult<DTOCommunityInteractionForRead>> UpdateCommunityInteraction(int id ,DTOCommunityInteractionForUpdate dto)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.Parse(userIdClaims);
            var interaction = await _context.CommunityInteractions.FindAsync(id);
            if(interaction == null)
            {
                return NotFound("Comment not found.");
            }
            if(interaction.UserId != userId)
            {
                return Forbid("You are not allowed to edit this comment.");
            }
            if (!string.IsNullOrWhiteSpace(dto.CommentContent))
            {
                interaction.CommentContent = dto.CommentContent;
            }
            interaction.isEdit = true;
            interaction.EditedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Update Commented");
        }
        [HttpDelete("DeleteComment/{id}")]
        [Authorize(Roles = "Member,Admin,Coach")]
        public async Task<ActionResult> deleteCommunityInteraction(int id)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.Parse(userIdClaims);
            var roles = User.FindFirst(ClaimTypes.Role)?.Value;
            var interaction = await _communityInteractionRepository.GetByIdAsync(id);
            if(interaction == null)
            {
                return NotFound("Comment not found.");
            }
            if(interaction.UserId == userId || roles == "Coach, Admin" )
            {
                _context.Remove(interaction);
                await _context.SaveChangesAsync();
            }
            else
            {
                return Forbid("You are not allowed to delete this comment.");
            }
            return Ok("deleted");
        }
    }
}
