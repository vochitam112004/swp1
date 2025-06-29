using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSpport.DTOs;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
namespace WebSmokingSupport.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly IChatMessageRepository _chatMessageRepository;
        public ChatMessageController(IChatMessageRepository chatMessageRepository)
        {
            _chatMessageRepository = chatMessageRepository;
        }
        [HttpPost("send")]
        public async Task<ActionResult> SendMessage([FromBody] DTOChatMessageForCreate dto)
        {
            if (dto == null || dto.ReceiverId <= 0 || string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest("Invalid chat message data.");
            }
            var senderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (senderId <= 0)
            {
                return Unauthorized("You are not authorized to send this message.");
            }
            var newchatMessage = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Content = dto.Content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };
            await _chatMessageRepository.CreateAsync(newchatMessage);
            return Ok("Message sent successfully.");
        }
        [HttpGet("history/{userId}")]
        public async Task<ActionResult> GetChatHistory(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("Invalid user ID.");
            }
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (currentUserId <= 0)
            {
                return Unauthorized("You are not authorized to view this chat history.");
            }
            var chatHistory = await _chatMessageRepository.GetChatMessageHistory(currentUserId, userId);
            if (chatHistory == null || !chatHistory.Any())
            {
                return NotFound("No chat history found.");
            }
            return Ok(chatHistory);
        }
    }
}
