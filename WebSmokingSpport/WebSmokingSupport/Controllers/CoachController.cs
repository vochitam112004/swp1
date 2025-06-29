using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Data;
using WebSmokingSupport.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoachController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IUserRepository _userRepository;
        public CoachController(QuitSmokingSupportContext context, IUserRepository userRepository)
        {
            this._context = context;
            _userRepository = userRepository;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("create-coach-by-Admin")]
        public async Task<ActionResult> CreateCoach([FromBody] DTOAdminResgisterCoach dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existedUser = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existedUser != null)
            {
                return BadRequest("Username already existed");
            }
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.passWord);
            var newUser = new User
            {
                Username = dto.Username,
                PasswordHash = hashedPassword,
                Address = dto.Address,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                DisplayName = dto.DisplayName,
                UserType = dto.UserType,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            var CoachResponse = new DTOCoachResponse
            {

                DisplayName = newUser.DisplayName,
                Address = newUser.Address,
                Email = newUser.Email,
                PhoneNumber = newUser.PhoneNumber,
                UserType = newUser.UserType,
                Avatar = newUser.AvatarUrl,
                CreatedAt = newUser.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = newUser.UpdatedAt,
            };
            return Ok(new
            {
                message = $"{dto.UserType} created successfully.",
                userId = newUser.UserId,
                userType = newUser.UserType
            });
        }
        [HttpGet]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult<IEnumerable<DTOCoachResponse>>> GetAllCoaches()
        {
            var coaches = await _context.Users
                .Where(u => u.UserType == "Coach" && u.IsActive == true)
                .Select(u => new DTOCoachResponse
                {
                    DisplayName = u.DisplayName,
                    Address = u.Address,
                    Email = u.Email,
                    Username = u.Username,
                    PhoneNumber = u.PhoneNumber,
                    UserType = u.UserType,
                    Avatar = u.AvatarUrl,
                    CreatedAt = u.CreatedAt ?? DateTime.MinValue,
                    UpdatedAt = u.UpdatedAt
                }).ToListAsync();
            if (coaches == null || !coaches.Any())
            {
                return NotFound("No active coaches found.");
            }
            return Ok(coaches);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCoach(int id)
        {
            var userCoach = await _context.Users.FindAsync(id);
            if (userCoach == null || userCoach.UserType != "Coach")
            {
                return NotFound($"Coach not found with ID = {id} or not User Type Coach"); 
            }
            userCoach.IsActive = false;
            userCoach.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Coach deactivated successfully.");
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DTOCoachResponse>> GetCoachById(int id)
        {
            var coach = await _context.Users
                .Where(cp => cp.UserId == id)
                .Select(cp => new DTOCoachResponse
                {
                    DisplayName = cp.DisplayName,
                    Address = cp.Address,
                    Email = cp.Email,
                    Username = cp.Username, 
                    PhoneNumber = cp.PhoneNumber,
                    UserType = cp.UserType,
                    Avatar = cp.AvatarUrl,
                    CreatedAt = cp.CreatedAt ?? DateTime.MinValue,
                    UpdatedAt = cp.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (coach == null)
            {
                return NotFound("Coach not found with the given ID.");
            }

            return Ok(coach);
        }

    }
}
