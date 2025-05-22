using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class ChatMessage
{
    public int MessageId { get; set; }

    public int? SenderId { get; set; }

    public int? ReceiverId { get; set; }

    public string? Content { get; set; }

    public DateTime? SentAt { get; set; }

    public bool? IsRead { get; set; }

    public virtual User? Receiver { get; set; }

    public virtual User? Sender { get; set; }
}
