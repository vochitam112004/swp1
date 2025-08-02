using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Data;
using WebSmokingSupport.Interfaces;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Tls;
using Microsoft.AspNetCore.Identity;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoachController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<User> _userRepository;
        public CoachController(QuitSmokingSupportContext context, IGenericRepository<User> genericRepository)
        {
            this._context = context;
            this._userRepository = genericRepository;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("create-coach-by-Admin")]
        public async Task<ActionResult> CreateCoach([FromBody] DTOAdminResgisterCoach dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existed= await _userRepository.GetAllAsync();
            var existedUser = existed.FirstOrDefault(u => u.Username == dto.Username && u.UserType == "Coach");
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
                UserType = "Coach",
                IsActive = true,
                AvatarUrl = dto.AvatarUrl,
                CreatedAt = DateTime.UtcNow,
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            var coachProfile = new CoachProfile
            {
                UserId = newUser.UserId,
                CoachId = newUser.UserId,
                Specialization = dto.Specialization,
                CreateAt = DateTime.UtcNow
            };
            _context.CoachProfiles.Add(coachProfile);
            await _context.SaveChangesAsync();
            var response = new DTOCoachResponse
            {
                CoachId = newUser.UserId,
                DisplayName = newUser.DisplayName,
                Address = newUser.Address,
                Email = newUser.Email,
                Username = newUser.Username,
                PhoneNumber = newUser.PhoneNumber,
                Specialization = dto.Specialization,
                UserType = "Coach",
                AvatarUrl = newUser.AvatarUrl,
                CreatedAt = newUser.CreatedAt ?? DateTime.MinValue
            };
            return Ok(new
                {
                    message = $"{dto.UserType} created successfully.",
                    userId = newUser.UserId,
                    userType = newUser.UserType
                });
        }
        //[Authorize(Roles = "Admin")]
        //[HttpPost("create-admin")]
        //public async Task<ActionResult> CreateAdmin([FromBody] DTOAdminRegisterAdmin dto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var existedUser = await _userRepository.GetAllAsync();
        //    if (existedUser.Any(u => u.Username == dto.Username && u.UserType == "Admin"))
        //        return BadRequest("Username already exists for Admin.");
        //    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        //    var newUser = new User
        //    {
        //        Username = dto.Username,
        //        Address = dto.Address,
        //        Email = dto.Email,
        //        PhoneNumber = dto.PhoneNumber,
        //        DisplayName = dto.DisplayName,
        //        UserType = "Admin",
        //        IsActive = true,
        //        AvatarUrl = dto.AvatarUrl,
        //        CreatedAt = DateTime.UtcNow,
        //    };

        //    _context.Users.Add(newUser);
        //    await _context.SaveChangesAsync();

        //    var adminProfile = new AdminProfile
        //    {
        //        AdminId = newUser.UserId,
        //        PermissionLevel = dto.PermissionLevel,
        //        CreatedAt = DateTime.UtcNow
        //    };

        //    _context.AdminProfiles.Add(adminProfile);
        //    await _context.SaveChangesAsync();

        //    var response = new DTOAdminResponse
        //    {
        //        AdminId = newUser.UserId,
        //        DisplayName = newUser.DisplayName,
        //        Address = newUser.Address,
        //        Email = newUser.Email,
        //        Username = newUser.Username,
        //        PhoneNumber = newUser.PhoneNumber,
        //        PermissionLevel = dto.PermissionLevel,
        //        UserType = "Admin",
        //        AvatarUrl = newUser.AvatarUrl,
        //        CreatedAt = newUser.CreatedAt ?? DateTime.MinValue
        //    };

        //    return Ok(new
        //    {
        //        message = "Admin created successfully.",
        //        data = response
        //    });
        //}
        [HttpGet]
        [Authorize(Roles ="Admin,Coach")]
        public async Task<ActionResult<IEnumerable<DTOCoachResponse>>> GetAllCoaches()
        {
            var coaches = await _context.Users
                .Where(u => u.UserType == "Coach" && u.IsActive == true)
                .Select(u => new DTOCoachResponse
                {
                    CoachId = u.UserId,
                    DisplayName = u.DisplayName,
                    Address = u.Address,
                    Email = u.Email,
                    Username = u.Username,
                    PhoneNumber = u.PhoneNumber,
                    Specialization = u.PhoneNumber,
                    UserType = u.UserType,
                    AvatarUrl = u.AvatarUrl,
                    CreatedAt = u.CreatedAt ?? DateTime.MinValue,
                    UpdatedAt = u.UpdatedAt
                }).ToListAsync();
            if (coaches == null || !coaches.Any())
            {
                return NotFound("No active coaches found.");
            }
            return Ok(coaches);
        }
  
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DTOCoachResponse>> GetCoachById(int id)
        {
            var coach = await _context.Users
                .Where(cp => cp.UserId == id)
                .Select(cp => new DTOCoachResponse
                {
                    CoachId = cp.UserId,
                    DisplayName = cp.DisplayName,
                    Address = cp.Address,
                    Email = cp.Email,
                    Username = cp.Username, 
                    PhoneNumber = cp.PhoneNumber,
                    UserType = cp.UserType,
                    AvatarUrl = cp.AvatarUrl,
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

        [HttpGet("countCoach")]
        [Authorize(Roles = "Admin,Coach")] 
        public async Task<ActionResult<int>> GetCoachCount()
        {
            
            var coachCount = await _context.Users
                                        .CountAsync(u => u.UserType == "Coach" && u.IsActive == true);

            return Ok(coachCount);
        }

        [HttpPut("{coachId}")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<ActionResult<DTOCoachResponse>> UpdateCoach(int coachId,
        [FromForm] DTOCoachForUpdate dto,IFormFile? avatarFile)
        {
            var coachProfile = await _context.CoachProfiles
                .Include(c => c.Coach) // Coach là User
                .FirstOrDefaultAsync(c => c.CoachId == coachId);

            if (coachProfile == null)
            {
                return NotFound("Coach not found.");
            }

            var user = coachProfile.Coach;

            // Update User fields
            if (!string.IsNullOrWhiteSpace(dto.UserName))
                user.Username = dto.UserName;
            if (!string.IsNullOrWhiteSpace(dto.DisplayName))
                user.DisplayName = dto.DisplayName;
            if (!string.IsNullOrWhiteSpace(dto.Email))
                user.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.Address))
                user.Address = dto.Address;
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                user.PhoneNumber = dto.PhoneNumber;
            if (dto.IsActive.HasValue)
                user.IsActive = dto.IsActive.Value;

            // Update CoachProfile fields
            if (!string.IsNullOrWhiteSpace(dto.Specialization))
                coachProfile.Specialization = dto.Specialization;

            // Upload avatar
            if (avatarFile != null && avatarFile.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(avatarFile.FileName)}";
                var savePath = Path.Combine("wwwroot/avatars", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await avatarFile.CopyToAsync(stream);
                }

                user.AvatarUrl = $"/avatars/{fileName}";
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Tạo response
            var response = new DTOCoachResponse
            {
                CoachId = coachProfile.CoachId,
                Username = user.Username,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Specialization = coachProfile.Specialization,
               
            };

            return Ok(response);
        }

        [HttpDelete("{coachId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCoach(int coachId)
        {
            var coachProfile = await _context.CoachProfiles
                .Include(c => c.Appointments)
                .Include(c => c.Coach)
                    .ThenInclude(u => u.ChatMessageSenders)
                .Include(c => c.Coach)
                    .ThenInclude(u => u.ChatMessageReceivers)
                .Include(c => c.Coach)
                    .ThenInclude(u => u.CommunityPosts)
                .Include(c => c.Coach)
                    .ThenInclude(u => u.Feedbacks)
                .FirstOrDefaultAsync(c => c.CoachId == coachId);

            if (coachProfile == null)
                return NotFound($"Coach with ID {coachId} not found.");

            int deletedAppointments = coachProfile.Appointments.Count;
            int deletedSentMessages = coachProfile.Coach.ChatMessageSenders.Count;
            int deletedReceivedMessages = coachProfile.Coach.ChatMessageReceivers.Count;
            int deletedPosts = coachProfile.Coach.CommunityPosts.Count;
            int deletedFeedbacks = coachProfile.Coach.Feedbacks.Count;

            // Xóa Appointments
            _context.Appointments.RemoveRange(coachProfile.Appointments);

            // Xóa ChatMessages (Sender & Receiver)
            _context.ChatMessages.RemoveRange(coachProfile.Coach.ChatMessageSenders);
            _context.ChatMessages.RemoveRange(coachProfile.Coach.ChatMessageReceivers);

            // Xóa Posts
            _context.CommunityPosts.RemoveRange(coachProfile.Coach.CommunityPosts);

            // Xóa Feedbacks
            _context.Feedbacks.RemoveRange(coachProfile.Coach.Feedbacks);

            // Xóa CoachProfile
            _context.CoachProfiles.Remove(coachProfile);

            // Xóa User
            _context.Users.Remove(coachProfile.Coach);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Coach {coachId} deleted successfully.",
                DeletedAppointments = deletedAppointments,
                DeletedSentMessages = deletedSentMessages,
                DeletedReceivedMessages = deletedReceivedMessages,
                DeletedPosts = deletedPosts,
                DeletedFeedbacks = deletedFeedbacks
            });
        }


    }
}
