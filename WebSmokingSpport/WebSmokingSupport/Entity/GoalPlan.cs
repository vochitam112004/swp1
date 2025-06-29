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

    public int? MemberId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? TargetQuitDate { get; set; }

    public string? PersonalMotivation { get; set; }

    public bool? UseTemplate { get; set; }

    public virtual MemberProfile? Member { get; set; }

    public virtual ICollection<MemberGoal> MemberGoals { get; set; } = new List<MemberGoal>();
}
