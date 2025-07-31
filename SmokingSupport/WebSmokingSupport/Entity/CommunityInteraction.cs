using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class CommunityInteraction
{
    public int InteractionId { get; set; }

    public int? PostId { get; set; }

    public int? UserId { get; set; }
    public bool? isEdit { get; set; } = false;
    public DateTime? EditedAt { get; set; }

    public string? CommentContent { get; set; }

    public DateTime? CommentedAt { get; set; }

    public virtual CommunityPost? Post { get; set; }

    public virtual User? User { get; set; }
}
