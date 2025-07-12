using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
namespace WebSmokingSupport.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CommunityPostController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;

        public CommunityPostController(QuitSmokingSupportContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DTOCommunityPostForRead>>> GetCommunityPosts()
        {
            var posts = await _context.CommunityPosts
                .Include(p => p.User)
                .Select(p => new DTOCommunityPostForRead
                {
                    PostId = p.PostId,
                    Content = p.Content,
                    CreatedAt = p.CreatedAt,
                    DisplayName = p.User != null ? p.User.DisplayName : "Ẩn danh",
                    Title = p.Title,
                    ImageUrl = p.ImageUrl,
                })
                .ToListAsync();

            return Ok(posts);
        }
        [HttpPost]
        [Authorize(Roles ="Member")]
        public async Task<ActionResult> CreateCommunityPost([FromBody] DTOCommunityPostForCreate dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var post = new CommunityPost
            {
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                ImageUrl = dto.ImageUrl,
                UserId = userId
            };

            _context.CommunityPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post created successfully." });
        }
        [Authorize(Roles = "Member")]
        [HttpPut("{postId}")]
        public async Task<ActionResult<DTOCommunityPostForRead>> UpdatePost(int postId, [FromBody] DTOComunityPostForUpdate dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var post = await _context.CommunityPosts
                .FirstOrDefaultAsync(p => p.PostId == postId && p.UserId == userId);
            if (post == null)
                return NotFound("Post not found or you're not the owner.");

            if (!string.IsNullOrWhiteSpace(dto.Title))
            {
                post.Title = dto.Title;
            }
            if (!string.IsNullOrWhiteSpace(dto.Content))
            {
                post.Content = dto.Content;
            }
            if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                post.ImageUrl = dto.ImageUrl;
            }

            post.CreatedAt = DateTime.UtcNow;
            _context.CommunityPosts.Update(post);
            await _context.SaveChangesAsync();
            var updatedPost = new DTOCommunityPostForRead
            {
                PostId = post.PostId,
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                ImageUrl = post.ImageUrl,
                DisplayName = post.User != null ? post.User.DisplayName : "Ẩn danh"
            };
            return Ok(updatedPost);
        }
        [HttpDelete("{postId}")]
        [Authorize(Roles = "Member , Admin")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            var post = await _context.CommunityPosts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }
            _context.CommunityPosts.Remove(post);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Post deleted successfully." });
        }
    }
}
