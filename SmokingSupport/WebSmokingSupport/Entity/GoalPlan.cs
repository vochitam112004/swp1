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
    public int MemberId { get; set; } 
    public int UserId { get; set; } 
    public DateOnly StartDate { get; set; } // ngày bắt đầu kế hoạch
    public bool isCurrentGoal { get; set; } = true;
    public DateOnly EndDate { get; set; } // ngày kết thúc kế hoạch
    public int TotalDays { get; set; }  // tổng số ngày trong kế hoạch
    public DateTime CreatedAt { get; set; } 
    public DateTime? UpdatedAt { get; set; } 
    public virtual MemberProfile? Member { get; set; }
    public virtual ICollection<ProgressLog> ProgressLogs { get; set; } = new List<ProgressLog>();
    public virtual ICollection<GoalPlanWeeklyReduction> GoalPlanWeeklyReductions { get; set; } = new List<GoalPlanWeeklyReduction>();

}
