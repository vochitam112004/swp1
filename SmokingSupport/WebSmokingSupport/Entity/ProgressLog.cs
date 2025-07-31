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

    public int? MemberId { get; set; } // Foreign key to MemberProfile

    public int? CigarettesSmoked { get; set; }
    public decimal? PricePerPack { get; set; }

    public string? Mood { get; set; }

    public int CigarettesPerPack { get; set; } // Note: This is not nullable.
    public DateTime? CreatedAt { get; set; }

    [Required]
    public DateOnly LogDate { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Notes { get; set; }

    public int? GoalPlanId { get; set; } 
    public virtual MemberProfile? Member { get; set; } 
    public virtual GoalPlan? GoalPlan { get; set; }
}
