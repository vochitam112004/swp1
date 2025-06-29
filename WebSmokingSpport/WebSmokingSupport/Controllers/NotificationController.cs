//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using WebSmokingSupport.DTOs;
//using WebSmokingSupport.Entity;
//using WebSmokingSupport.Interfaces;

//namespace WebSmokingSupport.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class NotificationController : ControllerBase
//    {
//        private readonly IGenericRepository<Notification> _notification;
//        public NotificationController(IGenericRepository<Notification> notification)
//        {
//            _notification = notification;
//        }
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<DTONotificationForRead>>> GetAllNotifications()
//        {
//            var notifications = await _notification.GetAllAsync();
//            if (notifications == null || !notifications.Any())
//            {
//                return NotFound("No notifications found.");
//            }
//            var notificationResponses = notifications.Select(n => new DTONotificationForRead
//            {
//                NotificationId = n.NotificationId,
//                MemberId = n.MemberId,
//                Content = n.Content,
//                Type = n.Type,
//                CreatedAt = n.CreatedAt,
//                IsRead = n.IsRead,
//                MemberDisplayName = n.Member?.Member?.DisplayName,
//            }).ToList();
//            return Ok(notificationResponses);
//        }
//        [HttpGet("{id}")]
//        public async Task<ActionResult<DTONotificationForRead>> GetNotificationById(int id)
//        {
//            if (id <= 0)
//            {
//                return BadRequest("Invalid notification ID.");
//            }
//            var notification = await _notification.GetByIdAsync(id);
//            if (notification == null)
//            {
//                return NotFound("Notification not found.");
//            }
//            var notificationResponse = new DTONotificationForRead
//            {
//                NotificationId = notification.NotificationId,
//                MemberId = notification.MemberId,
//                Content = notification.Content,
//                Type = notification.Type,
//                CreatedAt = notification.CreatedAt,
//                IsRead = notification.IsRead,
//                MemberDisplayName = notification.Member?.Member?.DisplayName
//            };
//            return Ok(notificationResponse);
//        }
//        [HttpPost]
//        public async Task<ActionResult> CreateNotifications([FromBody] DTONotificationForCreateAndUpdate notificationDto)
//        {
//            if (notificationDto == null)
//            {
//                return BadRequest("Notification data is required.");
//            }
//            var newNotification = new Notification
//            {
//                MemberId = notificationDto.MemberId,
//                Content = notificationDto.Content,
//                Type = notificationDto.Type,
//                CreatedAt = DateTime.UtcNow,
//                IsRead = false
//            };
//            await _notification.CreateAsync(newNotification);
//            return CreatedAtAction(nameof(GetNotificationById), new { id = newNotification.NotificationId }, newNotification);
//        }
//        [HttpPut("{id}")]
//        public async Task<ActionResult> UpdateNotification(int id, [FromBody] DTONotificationForCreateAndUpdate notificationDto)
//        {
//            if (id <= 0 || notificationDto == null)
//            {
//                return BadRequest("Invalid notification ID or data.");
//            }
//            var existingNotification = await _notification.GetByIdAsync(id);
//            if (existingNotification == null)
//            {
//                return NotFound("Notification not found.");
//            }
//            existingNotification.MemberId = notificationDto.MemberId;
//            existingNotification.Content = notificationDto.Content;
//            existingNotification.Type = notificationDto.Type;
//            existingNotification.IsRead = notificationDto.IsRead;
//            existingNotification.CreatedAt = DateTime.UtcNow;
//            var result = await _notification.UpdateAsync(existingNotification);
//            if (result <= 0)
//            {
//                return BadRequest("Failed to update notification.");
//            }
//            return NoContent();
//        }
//        [HttpDelete("{id}")]
//        public async Task<ActionResult> DeleteNotification(int id)
//        {
//            if (id <= 0)
//            {
//                return BadRequest("Invalid notification ID.");
//            }
//            var notification = await _notification.GetByIdAsync(id);
//            if (notification == null)
//            {
//                return NotFound("Notification not found.");
//            }
//            var result = await _notification.RemoveAsync(notification);
//            return NoContent();
//        }
//    }
//}
