using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOChatMessageForCreate
    {
       
        [Required]
        public int? ReceiverId { get; set; } // UserId receive
        [Required]
        public string? Content { get; set; }

    }
}
