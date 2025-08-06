using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        public NotificationController(QuitSmokingSupportContext context)
        {
            this._context = context;
        }

        [HttpGet("GetNotifications")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<IEnumerable<DTONotificationForRead>>> GetNotifications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("User not authenticated.");
            int userId = int.Parse(userIdClaim.Value);
            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.UserId == userId);
            if (member == null)
            {
                return NotFound("Member profile not found.");
            }
                var notifications = await _context.Notifications
                .Where(n => n.MemberId == member.MemberId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new DTONotificationForRead
                {
                    NotificationId = n.NotificationId,
                    MemberId = n.MemberId,
                    Type = n.Type,
                    Content = n.Content,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead
                })
                .ToListAsync();
            if (notifications == null || !notifications.Any())
            {
                return NotFound("No notifications found for the user.");
            }
            return Ok(notifications);
        }

        [HttpGet("GetNotificationsForMember/{memberId}")]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult<IEnumerable<DTONotificationForRead>>> GetNotificationsForMember(int memberId)
        {
            var member = await _context.MemberProfiles.FindAsync(memberId);
            if (member == null)
                return NotFound($"Không tìm thấy thành viên với ID {memberId}.");

            var notifications = await _context.Notifications
                .Where(n => n.MemberId == memberId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new DTONotificationForRead
                {
                    NotificationId = n.NotificationId,
                    MemberId = n.MemberId,
                    Type = n.Type,
                    Content = n.Content,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead
                })
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return NotFound($"Không có thông báo nào cho thành viên có ID {memberId}.");
            }

            return Ok(notifications);
        }

        [HttpPost("CreateNotification")]
        [Authorize(Roles = "Admin, Coach")]
        public async Task<ActionResult> CreateNotification( int memberId , [FromBody]DTONotificationForCreate dto)
        {
            var member = await _context.MemberProfiles
                .FirstOrDefaultAsync(m => m.MemberId == memberId);
            if (member == null)
            {
                return NotFound("Member not found.");
            }
            var notification = new Notification
            {
                MemberId = memberId,
                Type = dto.Type,
                Content = dto.Content,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
            };
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNotifications), new { memberId = memberId }, new DTONotificationForRead
            {
                NotificationId = notification.NotificationId,
                MemberId = notification.MemberId,
                Type = notification.Type,
                Content = notification.Content,
                CreatedAt = notification.CreatedAt,
                IsRead = notification.IsRead
            });
        }

        [HttpPut("UpdateNotification/{notificationId}")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<IActionResult> UpdateNotification(int notificationId, [FromBody] DTONotificationForCreate dto)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId);
            if (notification == null)
            {
                return NotFound("Notification not found.");
            }
            notification.Type = dto.Type;
            notification.Content = dto.Content;
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("DeleteNotification/{notificationId}")]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<IActionResult> DeleteNotification(int notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId);
            if (notification == null)
            {
                return NotFound("Notification not found.");
            }
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("MarkAsRead/{notificationId}")]
        [Authorize(Roles = "Member, Coach, Admin")] 
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User not authenticated.");
                int userId = int.Parse(userIdClaim.Value);
                var currentMemberProfile = await _context.MemberProfiles
                                                         .FirstOrDefaultAsync(mp => mp.UserId == userId);

                if (currentMemberProfile == null)
                {
                    
                    return NotFound("Hồ sơ thành viên không tìm thấy cho người dùng này.");
                }

                var notification = await _context.Notifications
                                                 .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

                if (notification == null)
                    return NotFound("Thông báo không tìm thấy.");

                if (User.IsInRole("Member") && notification.MemberId != currentMemberProfile.MemberId) 
                {
                    return Forbid("Bạn không có quyền đánh dấu thông báo này.");
                }

                notification.IsRead = true;
                await _context.SaveChangesAsync(); 

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi nội bộ máy chủ khi đánh dấu thông báo đã đọc: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Stack Trace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi nội bộ máy chủ: {ex.Message}");
            }
        }

    }
}
