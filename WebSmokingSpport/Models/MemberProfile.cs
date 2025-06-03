using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class MemberProfile
{
    public int MemberId { get; set; }

    public string? SmokingStatus { get; set; }

    public int? QuitAttempts { get; set; }

    public int? ExperienceLevel { get; set; }

    public string? PreviousAttempts { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<CommunityPost> CommunityPosts { get; set; } = new List<CommunityPost>();

    public virtual ICollection<GoalPlan> GoalPlans { get; set; } = new List<GoalPlan>();

    public virtual User Member { get; set; } = null!;

    public virtual ICollection<MemberGoal> MemberGoals { get; set; } = new List<MemberGoal>();

    public virtual ICollection<MemberTrigger> MemberTriggers { get; set; } = new List<MemberTrigger>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<ProgressLog> ProgressLogs { get; set; } = new List<ProgressLog>();
}
