using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class AdminProfile
{
    public int AdminId { get; set; }

    public string? PermissionLevel { get; set; }
    public DateTime? CreatedAt { get; set; }

    public virtual User Admin { get; set; } = null!;
}
