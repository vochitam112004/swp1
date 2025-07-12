using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IGenericRepository<Feedback> _feedbackRepository;
        private readonly QuitSmokingSupportContext _context;
        public FeedbackController(IGenericRepository<Feedback> feedbackRepository, QuitSmokingSupportContext context)
        {
            this._context = context;
            this._feedbackRepository = feedbackRepository;
        }
        [HttpPost("SubmitFeedback")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<DTOFeedbackForCreate>> CreateFeedback([FromBody] DTOFeedbackForCreate dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest("Dữ liệu phản hồi không hợp lệ. bạn phải điền đầy đủ type và content");
            }
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim) || !int.TryParse(currentUserIdClaim, out int currentUserId) || currentUserId <= 0)
            {
                return Unauthorized("Bạn không có quyền gửi phản hồi.");
            }
            var feedback = new Feedback
            {
                UserId = currentUserId,
                Rating = dto.Rating > 0 ? dto.Rating : 0, // Ensure rating is non-negative
                isType = dto.isType,
                Content = dto.Content?.Trim(),
                SubmittedAt = DateTime.UtcNow
            };
            try
            {
                int result = await _feedbackRepository.CreateAsync(feedback);
                if (result > 0)
                {
                    return Ok(new { Message = "Phản hồi đã được gửi thành công." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Không thể gửi phản hồi. Vui lòng thử lại sau.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi nội bộ máy chủ: {ex.Message}");
            }
        }
        [HttpPut("UpdateFeedbackById/{FeedbackId}")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<DTOFeedbackForRead>> UpdateFeedbackById(int FeedbackId, [FromBody] DTOFeedbackForCreate dto)
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserIdClaim) || !int.TryParse(currentUserIdClaim, out int currentUserId) || currentUserId <= 0)
            {
                return Unauthorized("Bạn không có quyền cập nhật phản hồi.");
            }
            var feedback = await _feedbackRepository.GetByIdAsync(FeedbackId);
            if (feedback == null)
            {
                return NotFound($"Phản hồi với ID {FeedbackId} không tìm thấy.");
            }
            if (feedback.UserId != currentUserId)
            {
                return Forbid("Bạn không có quyền cập nhật phản hồi này.");
            }
            if (dto.isType.HasValue)
            {
                feedback.isType = dto.isType;
            }
            if (!string.IsNullOrWhiteSpace(dto.Content))
            {
                feedback.Content = dto.Content.Trim();
            }
            if (dto.Rating < 0 || dto.Rating > 5)
            {
                return BadRequest("Đánh giá phải nằm trong khoảng từ 0 đến 5.");
            }
            else
            {
                if (dto.Rating.HasValue)
                {
                    feedback.Rating = dto.Rating.Value;
                }
            }
            feedback.SubmittedAt = DateTime.UtcNow;
            await _feedbackRepository.UpdateAsync(feedback);
            var feedbackReponse = new DTOFeedbackForRead
            {
                FeedbackId = feedback.FeedbackId,
                UserId = feedback.UserId,
                isType = feedback.isType,
                Rating = feedback.Rating,
                Content = feedback.Content,
                SubmittedAt = feedback.SubmittedAt
            };
            return Ok(feedbackReponse);
        }
        [HttpGet("GetAllFeedbacksMemberByAdmin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DTOFeedbackForRead>> GetAllFeedbackMember()
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .Where(f =>f.isType == false)
                    .ToListAsync();
                if (feedbacks == null || feedbacks.Count == 0)
                {
                    return NotFound("Không có phản hồi nào.");
                }
                var dtoFeedbacks = feedbacks.Select(f => new DTOFeedbackForRead
                {
                    FeedbackId = f.FeedbackId,
                    UserId = f.UserId,
                    isType = f.isType,
                    Content = f.Content,
                    Rating = f.Rating,
                    DisPlayName = f.User?.DisplayName,
                    SubmittedAt = f.SubmittedAt
                }).ToList();
                return Ok(dtoFeedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi nội bộ máy chủ: {ex.Message}");
            }
        }
        [HttpGet("GetFeedbacksMemberForCoachByAdmin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DTOFeedbackForRead>> GetSystemFeedbacks()
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .Where(f => f.isType == true)
                    .ToListAsync();
                if (feedbacks == null || feedbacks.Count == 0)
                {
                    return NotFound("Không có phản hồi nào.");
                }
                var dtoFeedbacks = feedbacks.Select(f => new DTOFeedbackForRead
                {
                    FeedbackId = f.FeedbackId,
                    UserId = f.UserId,
                    isType = f.isType,
                    Content = f.Content,
                    Rating = f.Rating,
                    DisPlayName = f.User?.DisplayName,
                    SubmittedAt = f.SubmittedAt
                }).ToList();
                return Ok(dtoFeedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi nội bộ máy chủ: {ex.Message}");
            }
        }
        [HttpGet("PublicSystemFeedbacks")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<DTOFeedbackForRead>>> GetPublicSystemFeedbacks()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.User)
                .Where(f => f.isType == false)
                .ToListAsync();

            if (!feedbacks.Any())
                return NotFound("Không có phản hồi trải nghiệm nào.");

            var result = feedbacks.Select(f => new DTOFeedbackForRead
            {
                FeedbackId = f.FeedbackId,
                DisPlayName = f.User?.DisplayName,
                Content = f.Content,
                Rating = f.Rating,
                SubmittedAt = f.SubmittedAt,
                isType = false
            });

            return Ok(result);
        }
        [HttpDelete("DeleteFeedback/{FeedbackId}")]
        [Authorize(Roles = "Admin,Member")]
        public async Task<ActionResult> DeleteFeedback(int FeedbackId)
        {
            var feedback = await _feedbackRepository.GetByIdAsync(FeedbackId);
            if (feedback == null)
            {
                return NotFound($"Phản hồi với ID {FeedbackId} không tìm thấy.");
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(userIdClaim, out int userId);

            // Nếu là Member
            if (userRole == "Member")
            {
                // Không phải feedback của mình hoặc là feedback về coach thì cấm xóa
                if (feedback.UserId != userId || feedback.isType == true)
                {
                    return Forbid("Bạn không có quyền xóa phản hồi này.");
                }
            }

            try
            {
                bool isRemoved = await _feedbackRepository.RemoveAsync(feedback);
                if (isRemoved)
                {
                    return Ok(new { Message = "Phản hồi đã được xóa thành công." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Không thể xóa phản hồi. Vui lòng thử lại sau.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi nội bộ máy chủ: {ex.Message}");
            }
        }

    }
}
