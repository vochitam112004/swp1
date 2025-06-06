using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class AdminProfile
{
    public int AdminId { get; set; }

    public string? PermissionLevel { get; set; }

    public virtual User Admin { get; set; } = null!;
}
