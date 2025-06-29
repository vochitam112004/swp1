using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using WebSmokingSpport.DTOs;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Repositories;
using WebSmokingSupport.Entity;
using WebSmokingSupport.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
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
        public UserController(
            IGenericRepository<User> userRepository,
            IOtpService otpService,
            IEmailService emailService
            )
        {
            _userRepository = userRepository;
            _otpService = otpService;
            _emailService = emailService;
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
        [HttpPut]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult> UpdateUser([FromBody] DTOUserForUpdate dto)
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
            if (!string.IsNullOrWhiteSpace(dto.AvatarUrl))
            {
                user.AvatarUrl = dto.AvatarUrl;
            }
            if (dto.IsActive.HasValue)
            {
                user.IsActive = dto.IsActive.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int id))
            {
                return Unauthorized("User not authenticated.");
            }
            var user = (await _userRepository.GetAllAsync()).FirstOrDefault(u => u.UserId == id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var result = await _userRepository.RemoveAsync(user);
            if (result)
            {
                return NoContent();
            }
            return (StatusCode(500, "An error occurred while deleting the user."));
        }


        [Authorize(Roles = "Member")]
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

        [Authorize(Roles = "Member")]
        [HttpPost("request-change-password-otp")]
        public async Task<IActionResult> RequestChangePasswordOTP()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");


            var otp = new Random().Next(100000, 999999).ToString();

            // Lưu tạm OTP vào DB hoặc MemoryCache hoặc Redis
            await _otpService.SaveOtpAsync(user.Email, otp);

            await _emailService.SendEmailAsync(user.Email, "OTP for password change", $"Your OTP is: {otp}");

            return Ok("OTP sent to your email.");

        }

    }
}
