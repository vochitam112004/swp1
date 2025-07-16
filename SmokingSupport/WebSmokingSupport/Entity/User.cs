using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class User
{
    public int UserId { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public string? PasswordHash { get; set; }

    public string? DisplayName { get; set; }

    public string? UserType { get; set; }

    public string? AvatarUrl { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual AdminProfile? AdminProfile { get; set; }

    public virtual ICollection<ChatMessage> ChatMessageReceivers { get; set; } = new List<ChatMessage>();

    public virtual ICollection<ChatMessage> ChatMessageSenders { get; set; } = new List<ChatMessage>();

    public virtual CoachProfile? CoachProfile { get; set; }

    public virtual ICollection<CommunityInteraction> CommunityInteractions { get; set; } = new List<CommunityInteraction>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual MemberProfile? MemberProfile { get; set; }

    public virtual ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();

    public virtual ICollection<Ranking> Rankings { get; set; } = new List<Ranking>();

    public virtual ICollection<SystemReport> SystemReports { get; set; } = new List<SystemReport>();

    public virtual ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
    public virtual ICollection<CommunityPost> CommunityPosts { get; set; } = new List<CommunityPost>();

}
