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
        public async Task<IActionResult> UpdatePost(int postId, [FromBody] DTOComunityPostForUpdate dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var post = await _context.CommunityPosts
                .FirstOrDefaultAsync(p => p.PostId == postId && p.UserId == userId);
            if (post == null)
                return NotFound("Post not found or you're not the owner.");

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.CreatedAt = DateTime.UtcNow;
            post.ImageUrl = dto.ImageUrl;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{postId}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var post = await _context.CommunityPosts
                .FirstOrDefaultAsync(p => p.PostId == postId && p.UserId == userId);

            if (post == null)
                return NotFound("Post not found or you're not the owner.");

            _context.CommunityPosts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
