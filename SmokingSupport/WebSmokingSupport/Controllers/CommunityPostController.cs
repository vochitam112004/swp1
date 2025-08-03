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
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
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
        [AllowAnonymous]
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
        public async Task<ActionResult> CreateCommunityPost([FromForm] DTOCommunityPostForCreate dto, [FromServices] IWebHostEnvironment _env)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            string? imageUrl = null; 
            if(dto.ImageUrl != null && dto.ImageUrl.Length > 0)
            {
                var uploadPath = Path.Combine(_env.ContentRootPath, "uploads", "Post");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.ImageUrl.FileName);
                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageUrl.CopyToAsync(stream);
                }
                imageUrl = $"/uploads/Post/{fileName}"; 
            }
            var post = new CommunityPost
            {
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                ImageUrl = imageUrl,
            };

            _context.CommunityPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post created successfully." });
        }
        [Authorize(Roles = "Member")]
        [HttpPost("Update/{postId}")]
        public async Task<ActionResult<DTOCommunityPostForRead>> UpdatePost(int postId, [FromForm] DTOComunityPostForUpdate dto , [FromServices] IWebHostEnvironment _env)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var post = await _context.CommunityPosts
                .Include(p => p.User)
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
            if(dto.ImageUrl != null && dto.ImageUrl .Length > 0)
            {
                var uploadPath = Path.Combine(_env.ContentRootPath, "uploads", "Post");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.ImageUrl.FileName);
                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageUrl.CopyToAsync(stream);
                }
                post.ImageUrl = $"/uploads/Post/{fileName}"; 
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
                DisplayName = post.User?.DisplayName ?? "Ẩn danh"
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
