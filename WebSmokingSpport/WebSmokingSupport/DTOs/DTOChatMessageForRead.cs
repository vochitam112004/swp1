using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOChatMessageForRead
    {
        public int MessageId { get; set; }

        public int? SenderId { get; set; } // UserId send

        public int? ReceiverId { get; set; } // UserId receive

        public string? Content { get; set; }

        public DateTime? SentAt { get; set; }

        public bool? IsRead { get; set; }
    }
}
