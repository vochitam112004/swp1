using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class SystemReport
{
    public int ReportId { get; set; }

    public int? ReporterId { get; set; }

    public string? ReportType { get; set; }

    public DateTime? ReportedAt { get; set; }

    public string? Details { get; set; }

    public virtual User? Reporter { get; set; }
}
