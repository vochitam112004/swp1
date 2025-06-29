using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
namespace WebSmokingSupport.Entity;

public partial class ProgressLog
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int LogId { get; set; }

    public int? MemberId { get; set; }

    public DateOnly? LogDate { get; set; }

    public int? CigarettesSmoked { get; set; }
    public  decimal? PricePerPack { get; set; }

    public string? Mood { get; set; }

    public string? Trigger { get; set; }

    public string? Notes { get; set; }

    public virtual MemberProfile? Member { get; set; }
}
