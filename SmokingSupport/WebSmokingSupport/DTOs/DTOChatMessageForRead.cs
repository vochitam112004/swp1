using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOChatMessageForRead
    {
        public int MessageId { get; set; }

        public int? SenderId { get; set; } // UserId send
        public string? SenderDisplayName { get; set; } // DisplayName of sender

        public int? ReceiverId { get; set; } // UserId receive
        public string? ReceiverDisplayName { get; set; } // DisplayName of receiver

        public string? Content { get; set; }

        public DateTime? SentAt { get; set; }

        public bool? IsRead { get; set; }
    }
}
