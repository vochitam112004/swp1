using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using WebSmokingSpport.DTOs;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Repositories;
using WebSmokingSupport.Service;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IOtpService _otpService;
        private readonly IEmailService _emailService;
        private readonly QuitSmokingSupportContext _context;
        private readonly IWebHostEnvironment _env;
        public UserController(
            IGenericRepository<User> userRepository,
            IOtpService otpService,
            IEmailService emailService,
            QuitSmokingSupportContext context,
            IWebHostEnvironment env
            )
        {
            _userRepository = userRepository;
            _otpService = otpService;
            _emailService = emailService;
            _context = context;
            _env = env;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Coach, Member")]
        public async Task<ActionResult<DTOUserForRead>> GetMyUsers()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var users = (await _userRepository.GetAllAsync()).FirstOrDefault(u => u.UserId == userId);

            var userResponse = new DTOUserForRead
            {
                UserId = users.UserId,
                UserName = users.Username,
                DisplayName = users.DisplayName,
                Email = users.Email,
                Address = users.Address,
                PhoneNumber = users.PhoneNumber,
                UserType = users.UserType,
                AvatarUrl = users.AvatarUrl,
                CreatedAt = users.CreatedAt,
                UpdatedAt = users.UpdatedAt,
                IsActive = users.IsActive
            };
            return Ok(userResponse);
        }
        [HttpGet("Get-All-User")]
        [Authorize(Roles = "Admin , Coach")]
        public async Task<ActionResult<IEnumerable<DTOUserForRead>>> GetAllUser()
        {
            var userExisted = await _context.Users
                .Where(u => u.UserType == "Member" && u.IsActive == true)
                .Select(u => new DTOUserForRead
                {
                    UserId = u.UserId,
                    UserName = u.Username,
                    DisplayName = u.DisplayName,
                    UserType = u.UserType,
                    Address = u.Address,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    PhoneNumber = u.PhoneNumber,
                    Email = u.Email,
                    IsActive = u.IsActive,
                }).ToListAsync();
            if (userExisted == null || !userExisted.Any())
            {
                return NotFound("user not found");
            }
            return (userExisted);

        }
        [HttpPut("My-Update")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Member,Coach,Admin")]
        public async Task<ActionResult> UpdateUser([FromForm] DTOUserForUpdate dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized("User not authenticated.");
            }
            var user = (await _userRepository.GetAllAsync()).FirstOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                user.Username = dto.UserName;
            }
            if (!string.IsNullOrWhiteSpace(dto.DisplayName))
            {
                user.DisplayName = dto.DisplayName;
            }
            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                user.Email = dto.Email;
            }
            if (!string.IsNullOrWhiteSpace(dto.Address))
            {
                user.Address = dto.Address;
            }
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                user.PhoneNumber = dto.PhoneNumber;
            }
            if (dto.AvatarFile != null && dto.AvatarFile.Length > 0)
            {
                if (!dto.AvatarFile.ContentType.StartsWith("image/"))
                {
                    return BadRequest("Tệp tải lên không phải là định dạng ảnh hợp lệ.");
                }

                try
                {
                    var uploadsDirectoryPath = Path.Combine(_env.ContentRootPath, "uploads", "avatars");

                    if (!Directory.Exists(uploadsDirectoryPath))
                    {
                        Directory.CreateDirectory(uploadsDirectoryPath);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.AvatarFile.FileName);
                    var filePath = Path.Combine(uploadsDirectoryPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.AvatarFile.CopyToAsync(stream);
                    }
 
                    user.AvatarUrl = $"/uploads/avatars/{fileName}";
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Lỗi khi tải lên ảnh đại diện: {ex.Message}");
                    return StatusCode(StatusCodes.Status500InternalServerError, $"Đã xảy ra lỗi khi tải lên ảnh đại diện: {ex.Message}");
                }
            }
            if (dto.IsActive.HasValue)
            {
                user.IsActive = dto.IsActive.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
        [HttpPut("{userId}")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Admin,Coach,Member")]
        public async Task<ActionResult<DTOUserForUpdate>> UpdateUser(int userId, [FromForm] DTOUserForUpdate dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                user.Username = dto.UserName;
            }
            if (!string.IsNullOrWhiteSpace(dto.DisplayName))
            {
                user.DisplayName = dto.DisplayName;
            }
            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                user.Email = dto.Email;
            }
            if (!string.IsNullOrWhiteSpace(dto.Address))
            {
                user.Address = dto.Address;
            }
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                user.PhoneNumber = dto.PhoneNumber;
            }
            if (dto.IsActive.HasValue)
            {
                user.IsActive = dto.IsActive.Value;
            }
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            var userResponse = new DTOUserForRead
            {
                UserId = user.UserId,
                UserName = user.Username,
                DisplayName = user.DisplayName,
                Email = user.Email,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                UserType = user.UserType,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                IsActive = user.IsActive
            };

            return Ok(userResponse);
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    return NotFound(new { message = "User not found." });

                // ====== Lấy các ID liên quan ======
                var memberIds = _context.MemberProfiles
                    .Where(m => m.UserId == userId)
                    .Select(m => m.MemberId)
                    .ToList();

                var coachIds = _context.CoachProfiles
                    .Where(c => c.UserId == userId)
                    .Select(c => c.CoachId)
                    .ToList();

                var goalPlanIds = _context.GoalPlans
                    .Where(g => memberIds.Contains(g.MemberId))
                    .Select(g => g.PlanId)
                    .ToList();

                var postIds = _context.CommunityPosts
                    .Where(p => p.UserId == userId)
                    .Select(p => p.PostId)
                    .ToList();

                // ====== Xóa dữ liệu phụ thuộc ======
                _context.ChatMessages.RemoveRange(_context.ChatMessages
                    .Where(c => c.SenderId == userId || c.ReceiverId == userId));

                _context.Feedbacks.RemoveRange(_context.Feedbacks.Where(f => f.UserId == userId));
                _context.Rankings.RemoveRange(_context.Rankings.Where(r => r.UserId == userId));
                _context.SystemReports.RemoveRange(_context.SystemReports.Where(s => s.ReporterId == userId));
                _context.PasswordResetTokens.RemoveRange(_context.PasswordResetTokens.Where(p => p.UserId == userId));
                _context.UserBadges.RemoveRange(_context.UserBadges.Where(b => b.UserId == userId));
                _context.UserMembershipHistories.RemoveRange(_context.UserMembershipHistories.Where(m => m.UserId == userId));

                // Appointments
                _context.Appointments.RemoveRange(_context.Appointments
                    .Where(a => (a.MemberId.HasValue && memberIds.Contains(a.MemberId.Value)) ||
                                (a.CoachId.HasValue && coachIds.Contains(a.CoachId.Value))));

                // ProgressLogs & GoalPlans
                _context.ProgressLogs.RemoveRange(_context.ProgressLogs
                    .Where(p => (p.GoalPlanId.HasValue && goalPlanIds.Contains(p.GoalPlanId.Value)) ||
                                (p.MemberId.HasValue && memberIds.Contains(p.MemberId.Value))));

                _context.GoalPlans.RemoveRange(_context.GoalPlans
                    .Where(g => memberIds.Contains(g.MemberId)));

                // Member Triggers & Notifications
                _context.MemberTriggers.RemoveRange(_context.MemberTriggers
                    .Where(t => t.MemberId.HasValue && memberIds.Contains(t.MemberId.Value)));
                _context.Notifications.RemoveRange(_context.Notifications
                    .Where(n => n.MemberId.HasValue && memberIds.Contains(n.MemberId.Value)));

                // Community Interactions & Posts
                _context.CommunityInteractions.RemoveRange(_context.CommunityInteractions
                    .Where(ci => (ci.UserId == userId) ||
                                 (ci.PostId.HasValue && postIds.Contains(ci.PostId.Value))));
                _context.CommunityPosts.RemoveRange(_context.CommunityPosts
                    .Where(p => p.UserId == userId));

                // Profiles
                _context.MemberProfiles.RemoveRange(_context.MemberProfiles.Where(m => m.UserId == userId));
                _context.CoachProfiles.RemoveRange(_context.CoachProfiles.Where(c => c.UserId == userId));

                // ====== Xóa chính User ======
                await _userRepository.RemoveAsync(user);

                // Lưu thay đổi
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error deleting user.",
                    detail = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }


        [HttpGet("Count-User")]
        public async Task<ActionResult<int>> CountUser()
        {
            var count = await _userRepository.GetAllAsync();
            var userCount = count.Count(u => u.UserType == "Member" && u.IsActive == true);
            return Ok(userCount);
        }
        [Authorize(Roles = "Member , Coach ,Admin")]
        [HttpPost("confirm-change-password")]
        public async Task<IActionResult> ConfirmChangePassword([FromBody] DTOConfirmChangePassword dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
                return BadRequest("Incorrect old password.");

            var isValidOtp = await _otpService.VerifyOtpAsync(user.Email, dto.Otp);
            if (!isValidOtp) return BadRequest("Invalid or expired OTP.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return Ok("Password changed successfully.");
        }

        [Authorize(Roles = "Member,Coach,Admin")]
        [HttpPost("request-change-password-otp")]
        public async Task<IActionResult> RequestChangePasswordOTP()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");


            var otp = new Random().Next(100000, 999999).ToString();

            await _otpService.SaveOtpAsync(user.Email, otp);

            await _emailService.SendEmailAsync(user.Email, "OTP for password change", $"Your OTP is: {otp}");

            return Ok("OTP sent to your email.");

        }

    }
}
