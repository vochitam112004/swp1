using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using WebSmokingSupport.Entity;
namespace WebSmokingSupport.Entity;

public partial class MemberProfile
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int MemberId { get; set; }
    public int UserId { get; set; } // Foreign key to User
    public string? SmokingStatus { get; set; }

    public int? QuitAttempts { get; set; }
    public int? ExperienceLevel { get; set; }

    public string? PreviousAttempts { get; set; }

    // Navigation properties
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<GoalPlan> GoalPlans { get; set; } = new List<GoalPlan>(); 
    public virtual User User { get; set; } = null!; 
    public virtual ICollection<MemberGoal> MemberGoals { get; set; } = new List<MemberGoal>();
    public virtual ICollection<MemberTrigger> MemberTriggers { get; set; } = new List<MemberTrigger>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<ProgressLog> ProgressLogs { get; set; } = new List<ProgressLog>();
}
