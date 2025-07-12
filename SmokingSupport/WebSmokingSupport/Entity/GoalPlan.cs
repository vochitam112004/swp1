using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSmokingSupport.Entity;

public partial class GoalPlan
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PlanId { get; set; }

    public int? MemberId { get; set; } // Foreign key to MemberProfile (can be nullable if a GoalPlan might exist without a Member, but typically it should not be null)

    public DateOnly? StartDate { get; set; }
    public DateOnly? TargetQuitDate { get; set; }
    public string? PersonalMotivation { get; set; }
    public bool? UseTemplate { get; set; }
    public bool? isCurrentGoal { get; set; } = true;
    public DateTime CreatedAt { get; set; } // Added property
    public DateTime? UpdatedAt { get; set; } // Added property

    // Navigation properties
    public virtual MemberProfile? Member { get; set; } // MemberId is nullable, so Member can be nullable (consider if MemberId should be [Required])

    // << XÓA: public ProgressLog? ProgressLog { get; set; } >> Đây là thừa, bạn đã có ICollection bên dưới

    public virtual ICollection<MemberGoal> MemberGoals { get; set; } = new List<MemberGoal>();
    public virtual ICollection<ProgressLog> ProgressLogs { get; set; } = new List<ProgressLog>(); // 
}
