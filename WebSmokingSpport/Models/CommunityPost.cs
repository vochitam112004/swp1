using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class CommunityPost
{
    public int PostId { get; set; }

    public int? MemberId { get; set; }

    public string? Content { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<CommunityInteraction> CommunityInteractions { get; set; } = new List<CommunityInteraction>();

    public virtual MemberProfile? Member { get; set; }
}
