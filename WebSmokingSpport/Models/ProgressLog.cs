using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class ProgressLog
{
    public int LogId { get; set; }

    public int? MemberId { get; set; }

    public DateOnly? LogDate { get; set; }

    public int? CigarettesSmoked { get; set; }

    public string? Mood { get; set; }

    public string? Trigger { get; set; }

    public string? Notes { get; set; }

    public virtual MemberProfile? Member { get; set; }
}
