using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.Entity;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int? UserId { get; set; }

    public bool? isType { get; set; }

    public string? Content { get; set; }
    [Range(0, 5)]
    public int? Rating { get; set; } = 0;

    public DateTime? SubmittedAt { get; set; }

    public virtual User? User { get; set; }
}
