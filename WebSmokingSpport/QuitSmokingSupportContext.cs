using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebSmokingSpport.Models;

namespace WebSmokingSpport;

public partial class QuitSmokingSupportContext : DbContext
{
    public QuitSmokingSupportContext()
    {
    }

    public QuitSmokingSupportContext(DbContextOptions<QuitSmokingSupportContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AdminProfile> AdminProfiles { get; set; }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Badge> Badges { get; set; }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<CoachProfile> CoachProfiles { get; set; }

    public virtual DbSet<CommunityInteraction> CommunityInteractions { get; set; }

    public virtual DbSet<CommunityPost> CommunityPosts { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<GoalPlan> GoalPlans { get; set; }

    public virtual DbSet<GoalTemplate> GoalTemplates { get; set; }

    public virtual DbSet<MemberGoal> MemberGoals { get; set; }

    public virtual DbSet<MemberProfile> MemberProfiles { get; set; }

    public virtual DbSet<MemberTrigger> MemberTriggers { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<ProgressLog> ProgressLogs { get; set; }

    public virtual DbSet<Ranking> Rankings { get; set; }

    public virtual DbSet<SystemReport> SystemReports { get; set; }

    public virtual DbSet<TriggerFactor> TriggerFactors { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBadge> UserBadges { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdminProfile>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__AdminPro__43AA41410C9FD967");

            entity.ToTable("AdminProfile");

            entity.Property(e => e.AdminId)
                .ValueGeneratedNever()
                .HasColumnName("admin_id");
            entity.Property(e => e.PermissionLevel)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("permission_level");

            entity.HasOne(d => d.Admin).WithOne(p => p.AdminProfile)
                .HasForeignKey<AdminProfile>(d => d.AdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AdminProf__admin__59FA5E80");
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__A50828FC397F9EE6");

            entity.ToTable("Appointment");

            entity.Property(e => e.AppointmentId)
                .ValueGeneratedNever()
                .HasColumnName("appointment_id");
            entity.Property(e => e.CoachId).HasColumnName("coach_id");
            entity.Property(e => e.EndTime)
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Notes)
                .HasColumnType("text")
                .HasColumnName("notes");
            entity.Property(e => e.StartTime)
                .HasColumnType("datetime")
                .HasColumnName("start_time");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");

            entity.HasOne(d => d.Coach).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.CoachId)
                .HasConstraintName("FK__Appointme__coach__44FF419A");

            entity.HasOne(d => d.Member).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Appointme__membe__440B1D61");
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasKey(e => e.BadgeId).HasName("PK__Badge__E79896563A608AAD");

            entity.ToTable("Badge");

            entity.Property(e => e.BadgeId)
                .ValueGeneratedNever()
                .HasColumnName("badge_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.IconUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("icon_url");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__ChatMess__0BBF6EE6E8C99D4E");

            entity.ToTable("ChatMessage");

            entity.Property(e => e.MessageId)
                .ValueGeneratedNever()
                .HasColumnName("message_id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.ReceiverId).HasColumnName("receiver_id");
            entity.Property(e => e.SenderId).HasColumnName("sender_id");
            entity.Property(e => e.SentAt)
                .HasColumnType("datetime")
                .HasColumnName("sent_at");

            entity.HasOne(d => d.Receiver).WithMany(p => p.ChatMessageReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .HasConstraintName("FK__ChatMessa__recei__412EB0B6");

            entity.HasOne(d => d.Sender).WithMany(p => p.ChatMessageSenders)
                .HasForeignKey(d => d.SenderId)
                .HasConstraintName("FK__ChatMessa__sende__403A8C7D");
        });

        modelBuilder.Entity<CoachProfile>(entity =>
        {
            entity.HasKey(e => e.CoachId).HasName("PK__CoachPro__2BEBE0446593A253");

            entity.ToTable("CoachProfile");

            entity.Property(e => e.CoachId)
                .ValueGeneratedNever()
                .HasColumnName("coach_id");
            entity.Property(e => e.Specialization)
                .HasColumnType("text")
                .HasColumnName("specialization");

            entity.HasOne(d => d.Coach).WithOne(p => p.CoachProfile)
                .HasForeignKey<CoachProfile>(d => d.CoachId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CoachProf__coach__29572725");
        });

        modelBuilder.Entity<CommunityInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId).HasName("PK__Communit__605F8FE61AB23251");

            entity.ToTable("CommunityInteraction");

            entity.Property(e => e.InteractionId)
                .ValueGeneratedNever()
                .HasColumnName("interaction_id");
            entity.Property(e => e.CommentContent)
                .HasColumnType("text")
                .HasColumnName("comment_content");
            entity.Property(e => e.CommentedAt)
                .HasColumnType("datetime")
                .HasColumnName("commented_at");
            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Post).WithMany(p => p.CommunityInteractions)
                .HasForeignKey(d => d.PostId)
                .HasConstraintName("FK__Community__post___4AB81AF0");

            entity.HasOne(d => d.User).WithMany(p => p.CommunityInteractions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Community__user___4BAC3F29");
        });

        modelBuilder.Entity<CommunityPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Communit__3ED78766740666E6");

            entity.ToTable("CommunityPost");

            entity.Property(e => e.PostId)
                .ValueGeneratedNever()
                .HasColumnName("post_id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.MemberId).HasColumnName("member_id");

            entity.HasOne(d => d.Member).WithMany(p => p.CommunityPosts)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Community__membe__47DBAE45");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__7A6B2B8CF55D8B2F");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId)
                .ValueGeneratedNever()
                .HasColumnName("feedback_id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.SubmittedAt)
                .HasColumnType("datetime")
                .HasColumnName("submitted_at");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("type");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Feedback__user_i__4E88ABD4");
        });

        modelBuilder.Entity<GoalPlan>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__GoalPlan__BE9F8F1DDA1BB507");

            entity.ToTable("GoalPlan");

            entity.Property(e => e.PlanId)
                .ValueGeneratedNever()
                .HasColumnName("plan_id");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.PersonalMotivation)
                .HasColumnType("text")
                .HasColumnName("personal_motivation");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.TargetQuitDate).HasColumnName("target_quit_date");
            entity.Property(e => e.UseTemplate).HasColumnName("use_template");

            entity.HasOne(d => d.Member).WithMany(p => p.GoalPlans)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__GoalPlan__member__2E1BDC42");
        });

        modelBuilder.Entity<GoalTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__GoalTemp__BE44E0792304EE26");

            entity.ToTable("GoalTemplate");

            entity.Property(e => e.TemplateId)
                .ValueGeneratedNever()
                .HasColumnName("template_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
        });

        modelBuilder.Entity<MemberGoal>(entity =>
        {
            entity.HasKey(e => e.MemberGoalId).HasName("PK__MemberGo__378ADBCE73D40F33");

            entity.ToTable("MemberGoal");

            entity.Property(e => e.MemberGoalId)
                .ValueGeneratedNever()
                .HasColumnName("member_goal_id");
            entity.Property(e => e.GoalId).HasColumnName("goal_id");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");

            entity.HasOne(d => d.Goal).WithMany(p => p.MemberGoals)
                .HasForeignKey(d => d.GoalId)
                .HasConstraintName("FK__MemberGoa__goal___31EC6D26");

            entity.HasOne(d => d.Member).WithMany(p => p.MemberGoals)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__MemberGoa__membe__30F848ED");
        });

        modelBuilder.Entity<MemberProfile>(entity =>
        {
            entity.HasKey(e => e.MemberId).HasName("PK__MemberPr__B29B85346B6BE499");

            entity.ToTable("MemberProfile");

            entity.Property(e => e.MemberId)
                .ValueGeneratedNever()
                .HasColumnName("member_id");
            entity.Property(e => e.ExperienceLevel).HasColumnName("experience_level");
            entity.Property(e => e.PreviousAttempts)
                .HasColumnType("text")
                .HasColumnName("previous_attempts");
            entity.Property(e => e.QuitAttempts).HasColumnName("quit_attempts");
            entity.Property(e => e.SmokingStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("smoking_status");

            entity.HasOne(d => d.Member).WithOne(p => p.MemberProfile)
                .HasForeignKey<MemberProfile>(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MemberPro__membe__267ABA7A");
        });

        modelBuilder.Entity<MemberTrigger>(entity =>
        {
            entity.HasKey(e => e.MemberTriggerId).HasName("PK__MemberTr__7D57174CFAE3EE99");

            entity.ToTable("MemberTrigger");

            entity.Property(e => e.MemberTriggerId)
                .ValueGeneratedNever()
                .HasColumnName("member_trigger_id");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.TriggerId).HasColumnName("trigger_id");

            entity.HasOne(d => d.Member).WithMany(p => p.MemberTriggers)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__MemberTri__membe__36B12243");

            entity.HasOne(d => d.Trigger).WithMany(p => p.MemberTriggers)
                .HasForeignKey(d => d.TriggerId)
                .HasConstraintName("FK__MemberTri__trigg__37A5467C");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__E059842F75703874");

            entity.ToTable("Notification");

            entity.Property(e => e.NotificationId)
                .ValueGeneratedNever()
                .HasColumnName("notification_id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("type");

            entity.HasOne(d => d.Member).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Notificat__membe__3D5E1FD2");
        });

        modelBuilder.Entity<ProgressLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Progress__9E2397E0E66BFCF8");

            entity.ToTable("ProgressLog");

            entity.Property(e => e.LogId)
                .ValueGeneratedNever()
                .HasColumnName("log_id");
            entity.Property(e => e.CigarettesSmoked).HasColumnName("cigarettes_smoked");
            entity.Property(e => e.LogDate).HasColumnName("log_date");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Mood)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("mood");
            entity.Property(e => e.Notes)
                .HasColumnType("text")
                .HasColumnName("notes");
            entity.Property(e => e.Trigger)
                .HasColumnType("text")
                .HasColumnName("trigger");

            entity.HasOne(d => d.Member).WithMany(p => p.ProgressLogs)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__ProgressL__membe__3A81B327");
        });

        modelBuilder.Entity<Ranking>(entity =>
        {
            entity.HasKey(e => e.RankingId).HasName("PK__Ranking__95F5B23D5BE08871");

            entity.ToTable("Ranking");

            entity.Property(e => e.RankingId)
                .ValueGeneratedNever()
                .HasColumnName("ranking_id");
            entity.Property(e => e.LastUpdated)
                .HasColumnType("datetime")
                .HasColumnName("last_updated");
            entity.Property(e => e.Score).HasColumnName("score");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Rankings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Ranking__user_id__5165187F");
        });

        modelBuilder.Entity<SystemReport>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__SystemRe__779B7C58BB933226");

            entity.ToTable("SystemReport");

            entity.Property(e => e.ReportId)
                .ValueGeneratedNever()
                .HasColumnName("report_id");
            entity.Property(e => e.Details)
                .HasColumnType("text")
                .HasColumnName("details");
            entity.Property(e => e.ReportType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("report_type");
            entity.Property(e => e.ReportedAt)
                .HasColumnType("datetime")
                .HasColumnName("reported_at");
            entity.Property(e => e.ReporterId).HasColumnName("reporter_id");

            entity.HasOne(d => d.Reporter).WithMany(p => p.SystemReports)
                .HasForeignKey(d => d.ReporterId)
                .HasConstraintName("FK__SystemRep__repor__5CD6CB2B");
        });

        modelBuilder.Entity<TriggerFactor>(entity =>
        {
            entity.HasKey(e => e.TriggerId).HasName("PK__TriggerF__23E04327247944B7");

            entity.ToTable("TriggerFactor");

            entity.Property(e => e.TriggerId)
                .ValueGeneratedNever()
                .HasColumnName("trigger_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__B9BE370F799BEE66");

            entity.ToTable("User");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("user_id");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("avatar_url");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DisplayName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("display_name");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("user_type");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UserBadge>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.BadgeId }).HasName("PK__UserBadg__C7C7BE6AD6279876");

            entity.ToTable("UserBadge");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.BadgeId).HasColumnName("badge_id");
            entity.Property(e => e.EarnedAt)
                .HasColumnType("datetime")
                .HasColumnName("earned_at");

            entity.HasOne(d => d.Badge).WithMany(p => p.UserBadges)
                .HasForeignKey(d => d.BadgeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserBadge__badge__571DF1D5");

            entity.HasOne(d => d.User).WithMany(p => p.UserBadges)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserBadge__user___5629CD9C");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
