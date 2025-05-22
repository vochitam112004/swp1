﻿using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class UserBadge
{
    public int UserId { get; set; }

    public int BadgeId { get; set; }

    public DateTime? EarnedAt { get; set; }

    public virtual Badge Badge { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
