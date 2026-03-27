using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class CommunityPost
{
    public int PostId { get; set; }

    public int? UserId  { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }

    public string? ImageUrl { get; set; } 
    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<CommunityInteraction> CommunityInteractions { get; set; } = new List<CommunityInteraction>();

    public virtual User? User { get; set; }
}
