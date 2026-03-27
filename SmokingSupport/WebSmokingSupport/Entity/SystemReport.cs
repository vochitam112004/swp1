using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSmokingSupport.Entity;

public partial class SystemReport
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ReportId { get; set; }

    public int? ReporterId { get; set; }

    public string? ReportType { get; set; }

    public DateTime? ReportedAt { get; set; }

    public string? Details { get; set; }

    public virtual User? Reporter { get; set; }
}
