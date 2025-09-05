using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Data;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly IChatMessageRepository _chatMessageRepository;
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<User> _userRepository;
        public ChatMessageController(IChatMessageRepository chatMessageRepository, QuitSmokingSupportContext context, IGenericRepository<User> userRepository)
        {
            _chatMessageRepository = chatMessageRepository;
            _context = context;
            _userRepository = userRepository;
        }
        /// <summary>
        /// gửi tin nhắn đến người dùng khác
        /// </summary>
        [HttpPost("send")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult> SendMessage([FromBody] DTOChatMessageForCreate dto)
        {
            if (dto == null || dto.ReceiverId <= 0 || string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest("Invalid chat message data.");
            }
            var senderIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(senderIdClaim) || !int.TryParse(senderIdClaim, out int senderId) || senderId <= 0)
            {
                return Unauthorized("You are not authorized to send messages.");
            }
            var receiver = await _userRepository.GetByIdAsync(dto.ReceiverId.Value);
            if (receiver == null)
            {
                return NotFound("Receiver not found.");
            }
            if (senderId == dto.ReceiverId)
            {
                return BadRequest("You cannot send a message to yourself.");
            }
            var newchatMessage = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Content = dto.Content.Trim(),
                SentAt = DateTime.UtcNow,
                IsRead = false
            };
            await _chatMessageRepository.CreateAsync(newchatMessage);
            return Ok("Message sent successfully.");
        }
        [HttpGet("history/{otherUserId}")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult> GetChatHistory(int otherUserId)
        {
            if (otherUserId <= 0)
            {
                return BadRequest("Invalid user ID.");
            }
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim) || !int.TryParse(currentUserIdClaim, out int currentUserId) || currentUserId <= 0)
            {
                return Unauthorized("You are not authorized to view chat history.");
            }
            var chatHistory = await _chatMessageRepository.GetChatMessageHistory(currentUserId, otherUserId);
            if (chatHistory == null || !chatHistory.Any())
            {
                return NotFound("No chat history found.");
            }
            var chatHistoryResponse = chatHistory.Select(msg => new DTOChatMessageForRead
            {
                MessageId = msg.MessageId,
                SenderId = msg.SenderId ?? 0,
                SenderDisplayName = msg.Sender?.DisplayName ?? "Unknown User",
                ReceiverId = msg.ReceiverId ?? 0,
                ReceiverDisplayName = msg.Receiver?.DisplayName ?? "Unknown User",
                Content = msg.Content,
                SentAt = msg.SentAt ?? DateTime.UtcNow,
                IsRead = msg.IsRead ?? false,
            }).ToList();
            return Ok(chatHistoryResponse);
        }

        [HttpPost("mark-as-read/{messageId}")]
        [Authorize(Roles = "Member,Coach")]
        public async Task<ActionResult> MarkMessageAsRead(int messageId)
        {
            if (messageId <= 0)
            {
                return BadRequest("Invalid message ID.");
            }
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim) || !int.TryParse(currentUserIdClaim, out int currentUserId) || currentUserId <= 0)
            {
                return Unauthorized("You are not authorized to mark messages as read.");
            }
            var messageToUpdate = await _context.ChatMessages.FindAsync(messageId);
            if (messageToUpdate == null)
            {
                return NotFound("Message not found."); 
            }

            if (messageToUpdate.ReceiverId != currentUserId)
            {
                return StatusCode( 403,"Bạn chỉ có thể đánh dấu các tin nhắn được gửi cho bạn là đã đọc.");
            }
            if (!messageToUpdate.IsRead ?? false)
            {
                messageToUpdate.IsRead = true;
                await _context.SaveChangesAsync();
            }
            return Ok("Message marked as read successfully.");
        }
        [HttpGet("recent-chat")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<IEnumerable<Object>>> GetRecentChatUsers()
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim) || !int.TryParse(currentUserIdClaim, out int currentUserId) || currentUserId <= 0)
            {
                return Unauthorized("You are not authorized to view recent chat users.");
            }
            var conversation = await _context.ChatMessages
                .Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();
            var chattedUserIds = conversation
                .SelectMany(m => new[] {m.SenderId , m.ReceiverId})
                .Where(id => id != currentUserId && id.HasValue)
                .Select(id => id.Value)
                .Distinct()
                .ToList();
            var chattedUsers = await _context.Users
                .Where(u => chattedUserIds.Contains(u.UserId))
                .Select(u => new
                {
                    UserId = u.UserId,
                    DisplayName = u.DisplayName,
                    UserType = u.UserType,
                    AvatarUrl = u.AvatarUrl,
             
                })
                .ToListAsync();

            return Ok(chattedUsers);
        }
        /// <summary>
        /// Lấy danh sách các Coach mà Member có thể chat, hoặc các Member mà Coach có thể chat.
        /// </summary>
        [HttpGet("available-contacts")]
        [Authorize(Roles = "Member,Coach")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableContacts()
        {
            var currentUserIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdString) || !int.TryParse(currentUserIdString, out int currentUserId) || currentUserId <= 0)
            {
                return Unauthorized("User not authenticated or current user ID invalid.");
            }

            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null)
            {
                return NotFound("Current user not found.");
            }

            IQueryable<User> contactsQuery;

            if (currentUser.UserType == "Member")
            {
                // Member chỉ có thể chat với Coach
                contactsQuery = _context.Users.Where(u => u.UserType == "Coach" && u.IsActive == true);
            }
            else if (currentUser.UserType == "Coach")
            {
                // Coach chỉ có thể chat với Member
                contactsQuery = _context.Users.Where(u => u.UserType == "Member" && u.IsActive == true);
            }
            else
            {
                // Admin hoặc các loại user khác không được hỗ trợ trong chức năng này hoặc có thể định nghĩa thêm
                return Forbid("Your user type is not authorized to access this functionality.");
            }

            var availableContacts = await contactsQuery
                .Select(u => new
                {
                    UserId = u.UserId,
                    DisplayName = u.DisplayName,
                    UserType = u.UserType,
                    AvatarUrl = u.AvatarUrl,
                    // Có thể thêm trạng thái online/offline nếu có logic quản lý
                })
                .ToListAsync();

            if (availableContacts == null || !availableContacts.Any())
            {
                return NotFound("No available contacts found.");
            }

            return Ok(availableContacts);
        }
    }
}
