using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int? UserId { get; set; }

    public string? Type { get; set; }

    public string? Content { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public virtual User? User { get; set; }
}
