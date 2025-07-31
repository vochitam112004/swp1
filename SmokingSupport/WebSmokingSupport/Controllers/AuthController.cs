using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Service;
using Google.Apis.Auth;
using System;
using System.Threading.Tasks;
using BCrypt.Net;
using WebSmokingSpport.DTOs;
using System.Reflection.Metadata.Ecma335;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using WebSmokingSupport.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using static System.Net.WebRequestMethods;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase

    {
        private readonly IGenericRepository<User> _genericUserRepository;
        private readonly IGenericRepository<PasswordResetToken> _passwordResetTokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly QuitSmokingSupportContext _context;
        public AuthController(
            IGenericRepository<User> genericUserRepository,
            IGenericRepository<PasswordResetToken> passwordResetTokenRepository,
            IUserRepository userRepository,
            IEmailService emailService,
            IJwtService jwtService,
            
            QuitSmokingSupportContext context)
        {
            _genericUserRepository = genericUserRepository;
            _passwordResetTokenRepository = passwordResetTokenRepository;
            _userRepository = userRepository;
            _jwtService = jwtService;
            _context = context;
            _emailService = emailService;
        }
        [HttpPost("google-login")]
        public async Task<ActionResult> GoogleLogin([FromBody] DTOGoogleLoginRequest googleLoginRequestDto)
        {
            if (string.IsNullOrWhiteSpace(googleLoginRequestDto.IdToken))
            {
                return BadRequest("IdToken is required.");
            }
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(googleLoginRequestDto.IdToken);
                var email = payload.Email;
                var name = payload.Name;
                var avatarUrl = payload.Picture;

                // Kiểm tra người dùng tồn tại 
                var user = await _userRepository.GetByEmailAsync(email);

                if (user == null)
                {
                    user = new Entity.User
                    {
                        Username = email,
                        Email = email,
                        DisplayName = name,
                        AvatarUrl = avatarUrl,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        UserType = "Member"
                    };
                    await _userRepository.CreateAsync(user);
                }
                var token = _jwtService.GenerateToken(user);
                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.UserId,
                        user.Username,
                        user.Email,
                        user.DisplayName,
                        user.AvatarUrl,
                        user.UserType,
                        user.IsActive,
                        user.CreatedAt,
                        user.UpdatedAt
                    }
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized("Invalid Google ID token.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
            }
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] DTOResgisterForUserName dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName))
            {
                return BadRequest("UserName is required.");
            }
            var existingUser = await _userRepository.GetByUsernameAsync(dto.UserName);
            if (existingUser != null)
            {
                return Conflict("Username already exist");
            }
            String passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var newUser = new User
            {
                Username = dto.UserName,
                PasswordHash = passwordHash,
                Email = dto.Email,
                DisplayName = dto.DisplayName,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserType = "Member"
            };
            await _userRepository.CreateAsync(newUser);
            return Ok(new { message = "User registered successfully" });
        }
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] DTOLoginForUserName dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Username and password are required.");
            }
            Console.WriteLine($"Login attempt for Username: {dto.Username}");
            var user = await _userRepository.GetByUsernameAsync(dto.Username);

            if (user == null)
            {
                Console.WriteLine("User not found by username."); 
                return Unauthorized("Invalid username or password.");
            }

            Console.WriteLine($"User found: {user.Username}, Email: {user.Email}, UserType: {user.UserType}");
            Console.WriteLine($"Input Password: {dto.Password}");
            Console.WriteLine($"Stored Hash: {user.PasswordHash}"); 

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                Console.WriteLine("Password verification failed."); 
                return Unauthorized("Invalid username or password.");
            }
            Console.WriteLine("Password verification successful."); 
            var token = _jwtService.GenerateToken(user);
            return Ok(new
            {
                message = "Login successful",
                token,
                user = new
                {
                    user.UserId,
                    user.Username,
                    user.Email,
                    user.DisplayName,
                    user.AvatarUrl,
                    user.UserType,
                    user.PhoneNumber,
                    user.Address,
                    user.IsActive,
                    user.CreatedAt,
                    user.UpdatedAt,

                }
            });
        }
        [HttpPost("request-reset")]
        public async Task<ActionResult> RequestPasswordReset([FromBody] DTOForgotPasswordRequestDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return NotFound("User with email not found.");

            var otp = new Random().Next(100000, 999999).ToString();

            var passwordResetToken = new PasswordResetToken
            {
                UserId = user.UserId,
                OtpCode = otp,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10)
            };

            await _context.PasswordResetTokens.AddAsync(passwordResetToken);
            await _context.SaveChangesAsync();
            try
            {
                var emailSubject = "Mã OTP đặt lại mật khẩu của bạn";
                var emailBody = $"Mã OTP để đặt lại mật khẩu của bạn là: <b>{otp}</b>. Mã này có hiệu lực trong 10 phút. Vui lòng không chia sẻ với ai.";
                await _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);
            }
            catch (Exception ex)
            {
               
                Console.WriteLine($"[ERROR] Không thể gửi OTP đến email {user.Email}: {ex.Message}");
            }
            Console.WriteLine($"[DEBUG] OTP gửi đến email {user.Email}: {otp}");

            return Ok("Password reset request successful. Please check your email for the OTP code.");
        }

        [HttpPost("verify-otp")]
        public async Task<ActionResult> VerifyOtp([FromBody] DTOVerifyOtp dto)
        {
            var token = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t =>
                    t.OtpCode == dto.OtpCode &&
        (t.ExpiresAt > DateTime.UtcNow) &&
        (t.IsUsed == false || t.IsUsed == null));

            if (token == null)
                return BadRequest("Invalid or expired OTP.");

            
            return Ok(new
            {
                message = "OTP verified successfully. Proceed to reset your password.",
                email = token.User.Email
            });
        }


        [HttpPost("reset-password")]
      
        public async Task<ActionResult> ResetPassword([FromBody] DTOResetPassword dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return NotFound("User with email not found.");

            var token = await _context.PasswordResetTokens.FirstOrDefaultAsync(t =>
                t.UserId == user.UserId &&
                t.OtpCode == dto.OtpCode &&
                t.ExpiresAt > DateTime.UtcNow);

            if (token == null)
                return BadRequest("Invalid OTP code or expired.");

            // Cập nhật mật khẩu
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            // Đánh dấu OTP đã dùng
            token.IsUsed = true;
            token.OtpCode = null;
            token.ExpiresAt = DateTime.UtcNow;

            _context.PasswordResetTokens.Update(token);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Password reset successfully. You can now login with your new password.");
        }
    }
}