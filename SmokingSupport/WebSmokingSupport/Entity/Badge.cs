using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.Entity;

public partial class Badge
{
    public int BadgeId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    [Required]
    public int RequiredScore { get; set; }

    public string? IconUrl { get; set; }

    public virtual ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}
