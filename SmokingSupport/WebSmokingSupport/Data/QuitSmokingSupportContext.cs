using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Entity;

namespace WebSmokingSupport.Data;

public partial class QuitSmokingSupportContext : DbContext
{
    public QuitSmokingSupportContext()
    {
    }

    public QuitSmokingSupportContext(DbContextOptions<QuitSmokingSupportContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Badge> Badges { get; set; }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<CoachProfile> CoachProfiles { get; set; }

    public virtual DbSet<CommunityInteraction> CommunityInteractions { get; set; }

    public virtual DbSet<CommunityPost> CommunityPosts { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<GoalPlan> GoalPlans { get; set; }

    public virtual DbSet<MemberProfile> MemberProfiles { get; set; }

    public virtual DbSet<MemberTrigger> MemberTriggers { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

    public virtual DbSet<ProgressLog> ProgressLogs { get; set; }

    public virtual DbSet<Ranking> Rankings { get; set; }

    public virtual DbSet<SystemReport> SystemReports { get; set; }

    public virtual DbSet<TriggerFactor> TriggerFactors { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<MembershipPlan> MembershipPlans { get; set; }
    public virtual DbSet<UserBadge> UserBadges { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-F3S9SQ2M;Database=QuitSmokingSupport;Trusted_Connection=True;TrustServerCertificate=True;");


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Vietnamese_CI_AS"); // hỗ trợ tiếng Việt

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__A50828FC474C821E");

            entity.ToTable("Appointment");

            entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
            entity.Property(e => e.CoachId).HasColumnName("coach_id");
            entity.Property(e => e.EndTime)
                .HasColumnType("time")
                .HasColumnName("end_time");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Notes)
                .IsUnicode(true) // ✅ cho phép ghi chú bằng tiếng Việt
                .HasColumnName("notes");
            entity.Property(e => e.StartTime)
                .HasColumnType("time")
                .HasColumnName("start_time");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(true) // ✅ hỗ trợ trạng thái tiếng Việt
                .HasColumnName("status");

            entity.HasOne(d => d.Coach).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.CoachId)
                .HasConstraintName("FK__Appointme__coach__47DBAE45");

            entity.HasOne(d => d.Member).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Appointme__membe__46E78A0C");
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasKey(e => e.BadgeId).HasName("PK__Badge__E798965682E49E67");

            entity.ToTable("Badge");

            entity.Property(e => e.BadgeId).HasColumnName("badge_id");
            entity.Property(e => e.Description)
                .IsUnicode(true) // ✅ mô tả tiếng Việt
                .HasColumnName("description");
            entity.Property(e => e.IconUrl)
                .HasMaxLength(255)
                .IsUnicode(true) // ✅ hỗ trợ URL có ký tự tiếng Việt (nếu cần)
                .HasColumnName("icon_url");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(true) // ✅ tên huy hiệu tiếng Việt
                .HasColumnName("name");
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__ChatMess__0BBF6EE61D02029B");

            entity.ToTable("ChatMessage");

            entity.Property(e => e.MessageId).HasColumnName("message_id");
            entity.Property(e => e.Content)
                .IsUnicode(true) // ✅ nội dung chat tiếng Việt
                .HasColumnName("content");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.ReceiverId).HasColumnName("receiver_id");
            entity.Property(e => e.SenderId).HasColumnName("sender_id");
            entity.Property(e => e.SentAt)
                .HasColumnType("datetime")
                .HasColumnName("sent_at");

            entity.HasOne(d => d.Receiver)
                .WithMany(p => p.ChatMessageReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .HasConstraintName("FK__ChatMessa__recei__440B1D61")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Sender)
                .WithMany(p => p.ChatMessageSenders)
                .HasForeignKey(d => d.SenderId)
                .HasConstraintName("FK__ChatMessa__sende__4316F928")
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<CoachProfile>(entity =>
        {
            entity.HasKey(e => e.CoachId).HasName("PK__CoachPro__2BEBE04471FE8045");

            entity.ToTable("CoachProfile");

            entity.Property(e => e.CoachId)
                .ValueGeneratedNever()
                .HasColumnName("coach_id");
            entity.Property(e => e.Specialization)
                .IsUnicode(true) // ✅ chuyên môn bằng tiếng Việt
                .HasColumnName("specialization");

            entity
                .HasOne(d => d.Coach)
                .WithOne(p => p.CoachProfile)
                .HasForeignKey<CoachProfile>(d => d.CoachId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__CoachProf__coach__2B3F6F97");
        });

        modelBuilder.Entity<CommunityInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId).HasName("PK__Communit__605F8FE6B07CC6E6");

            entity.ToTable("CommunityInteraction");

            entity.Property(e => e.InteractionId).HasColumnName("interaction_id");
            entity.Property(e => e.CommentContent)
                .IsUnicode(true) // ✅ bình luận tiếng Việt
                .HasColumnName("comment_content");
            entity.Property(e => e.CommentedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("commented_at");
            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Post).WithMany(p => p.CommunityInteractions)
                .HasForeignKey(d => d.PostId)
                .HasConstraintName("FK__Community__post___4F7CD00D");

            entity.HasOne(d => d.User).WithMany(p => p.CommunityInteractions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Community__user___5070F446");
        });

        modelBuilder.Entity<CommunityPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Communit__3ED787661C66F607");

            entity.ToTable("CommunityPost");

            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.Content)
                .IsUnicode(true) // ✅ nội dung bài viết tiếng Việt
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User)
                .WithMany(p => p.CommunityPosts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_CommunityPost_User");
        });


        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__7A6B2B8CCBD004F2");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");
            entity.Property(e => e.Content)
                .IsUnicode(true)
                .HasColumnName("content");
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("submitted_at");
            entity.Property(e => e.isType)
                .HasMaxLength(20)
                .IsUnicode(true)
                .HasColumnName("is_type");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Feedback__user_i__5441852A");
        });
        modelBuilder.Entity<GoalPlan>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__GoalPlan__BE9F8F1D4063912B");
            entity.ToTable("GoalPlan"); 
            entity.Property(e => e.PlanId).HasColumnName("plan_id");

            entity.Property(e => e.MemberId).HasColumnName("member_id");

            entity.Property(e => e.StartDate).HasColumnName("start_date").HasColumnType("date");
            entity.Property(e => e.TargetQuitDate).HasColumnName("target_quit_date").HasColumnType("date");
            entity.Property(e => e.PersonalMotivation).HasColumnName("personal_motivation").HasMaxLength(500);
            
        
            entity.Property(e => e.isCurrentGoal)
                  .HasColumnName("is_current_goal") 
                  .HasDefaultValue(true);
            

            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasColumnType("datetime").HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime");


            // Mối quan hệ MemberProfile - GoalPlan (1-N)
            // Một MemberProfile có NHIỀU GoalPlan
            entity.HasOne(gp => gp.Member) // GoalPlan có 1 MemberProfile
                  .WithMany(m => m.GoalPlans) // MemberProfile có NHIỀU GoalPlan
                  .HasForeignKey(gp => gp.MemberId) // Khóa ngoại MemberId là trong GoalPlan
                  .OnDelete(DeleteBehavior.SetNull); // Nếu MemberId là nullable, SetNull là hợp lý
                                                     // .HasConstraintName("FK__GoalPlan__member__300424B4"); // Giữ nguyên nếu bạn muốn tên constraint này

            // Ràng buộc duy nhất có điều kiện cho MemberId và isCurrentGoal
            // Đảm bảo chỉ có một GoalPlan là currentGoal = true cho mỗi Member
            entity.HasIndex(g => new { g.MemberId, g.isCurrentGoal })
                  .IsUnique()
                  .HasFilter("[is_current_goal] = 1"); // Sử dụng tên cột trong DB cho HasFilter

            // Mối quan hệ GoalPlan - ProgressLog (1-N)
            entity.HasMany(gp => gp.ProgressLogs) // GoalPlan có nhiều ProgressLog
                  .WithOne(pl => pl.GoalPlan)      // ProgressLog có một GoalPlan
                  .HasForeignKey(pl => pl.GoalPlanId) // Khóa ngoại GoalPlanId là trong ProgressLog
                  .OnDelete(DeleteBehavior.SetNull); // Yêu cầu ProgressLog.GoalPlanId là nullable
        });

        modelBuilder.Entity<MemberProfile>(entity =>
        {
            entity.HasKey(e => e.MemberId).HasName("PK__MemberPr__B29B85346E9D0FAF");
            entity.ToTable("MemberProfile");

            entity.Property(e => e.MemberId)
                .ValueGeneratedOnAdd()
                .HasColumnName("member_id");
            // ... other Property mappings for MemberProfile

            // Mối quan hệ MemberProfile - User (1-1)
            entity.HasOne(d => d.User)
                .WithOne(p => p.MemberProfile)
                .HasForeignKey<MemberProfile>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade) // OK: Khi User bị xóa, MemberProfile bị xóa
                .HasConstraintName("FK__MemberPro__user__286302EC");

            // Mối quan hệ MemberProfile - ProgressLog (1-N)
            // Khi MemberProfile bị xóa, các ProgressLog của nó cũng bị xóa.
            entity.HasMany(m => m.ProgressLogs) // MemberProfile có nhiều ProgressLog
                  .WithOne(pl => pl.Member)
                  .HasForeignKey(pl => pl.MemberId) 
                  .OnDelete(DeleteBehavior.Cascade); 
        });
        modelBuilder.Entity<MemberTrigger>(entity =>
        {
            entity.HasKey(e => e.MemberTriggerId).HasName("PK__MemberTr__7D57174C98FECA46");

            entity.ToTable("MemberTrigger");

            entity.Property(e => e.MemberTriggerId).HasColumnName("member_trigger_id");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.TriggerId).HasColumnName("trigger_id");

            entity.HasOne(d => d.Member).WithMany(p => p.MemberTriggers)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__MemberTri__membe__38996AB5");

            entity.HasOne(d => d.Trigger).WithMany(p => p.MemberTriggers)
                .HasForeignKey(d => d.TriggerId)
                .HasConstraintName("FK__MemberTri__trigg__398D8EEE");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__E059842F0C2FE15B");

            entity.ToTable("Notification");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.Content)
                .IsUnicode(false)
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(true)
                .HasColumnName("type");

            entity.HasOne(d => d.Member).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Notificat__membe__403A8C7D");
        });

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(e => e.TokenId).HasName("PK__Password__CB3C9E171E1B9166");

            entity.ToTable("PasswordResetToken");

            entity.Property(e => e.TokenId).HasColumnName("token_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExpiresAt)
                .HasColumnType("datetime")
                .HasColumnName("expires_at");
            entity.Property(e => e.IsUsed)
                .HasDefaultValue(false)
                .HasColumnName("is_used");
            entity.Property(e => e.OtpCode)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.PasswordResetTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PasswordR__user___693CA210");
        });

        modelBuilder.Entity<ProgressLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Progress__9E2397E0C035413C");
            entity.ToTable("ProgressLog");

            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.CigarettesSmoked).HasColumnName("cigarettes_smoked");
            entity.Property(e => e.LogDate).HasColumnName("log_date");
            entity.Property(e => e.MemberId).HasColumnName("member_id");

            entity.Property(e => e.Mood)
                .HasMaxLength(50)
                .IsUnicode(true)
                .HasColumnName("mood");
            entity.Property(e => e.Notes)
                .IsUnicode(true)
                .HasColumnName("notes");
            entity.Property(e => e.CigarettesPerPack)
                .HasColumnName("cigarettes_per_pack");
            entity.Property(e => e.PricePerPack)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("price_per_pack");
            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime");
            entity.Property(e => e.GoalPlanId)
            .HasColumnName("goal_plan_id")
            .IsRequired(false);
            entity.HasIndex(p => new { p.MemberId, p.LogDate });
        });

        modelBuilder.Entity<Ranking>(entity =>
        {
            entity.HasKey(e => e.RankingId).HasName("PK__Ranking__95F5B23D7FEC028F");

            entity.ToTable("Ranking");

            entity.Property(e => e.RankingId).HasColumnName("ranking_id");
            entity.Property(e => e.LastUpdated)
                .HasColumnType("datetime")
                .HasColumnName("last_updated");
            entity.Property(e => e.Score).HasColumnName("score");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Rankings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Ranking__user_id__571DF1D5");
        });
       
        OnModelCreatingPartial(modelBuilder);

        modelBuilder.Entity<MembershipPlan>(entity =>
        {
            entity.HasKey(e => e.PlanId);
            entity.Property(e => e.PlanId)
                  .HasColumnName("plan_id")
                  .ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
                  .HasColumnName("name")
                  .IsRequired() 
                  .HasMaxLength(100);
            entity.Property(e => e.Description)
                  .HasColumnName("description")
                  .IsRequired() 
                  .HasMaxLength(500); 
            entity.Property(e => e.DurationDays)
                  .HasColumnName("duration_days")
                  .IsRequired(); 
            entity.Property(e => e.Price)
                  .HasColumnName("price")
                  .HasColumnType("decimal(18,2)")
                  .IsRequired(); 
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("datetime")
                  .HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt)
                  .HasColumnName("updated_at")
                  .HasColumnType("datetime"); 
        });

        modelBuilder.Entity<SystemReport>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__SystemRe__779B7C58B194C859");

            entity.ToTable("SystemReport");

            entity.Property(e => e.ReportId).HasColumnName("report_id");
            entity.Property(e => e.Details)
                .IsUnicode(false)
                .HasColumnName("details");
            entity.Property(e => e.ReportType)
                .HasMaxLength(20)
                .IsUnicode(true)
                .HasColumnName("report_type");
            entity.Property(e => e.ReportedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("reported_at");
            entity.Property(e => e.ReporterId).HasColumnName("reporter_id");

            entity.HasOne(d => d.Reporter).WithMany(p => p.SystemReports)
                .HasForeignKey(d => d.ReporterId)
                .HasConstraintName("FK__SystemRep__repor__6477ECF3");
        });

        modelBuilder.Entity<TriggerFactor>(entity =>
        {
            entity.HasKey(e => e.TriggerId).HasName("PK__TriggerF__23E043277F15F271");

            entity.ToTable("TriggerFactor");

            entity.Property(e => e.TriggerId).HasColumnName("trigger_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(true)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__B9BE370F04CCF52D");

            entity.ToTable("User");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("address");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("avatar_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DisplayName)
                .HasMaxLength(100)
                .IsUnicode(true)
                .HasColumnName("display_name");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(true)
                .HasColumnName("email");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone_number");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
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
            // Defines the composite primary key for UserBadge
            entity.HasKey(e => new { e.UserId, e.BadgeId }).HasName("PK__UserBadg__C7C7BE6AD71688B5");


            entity.ToTable("UserBadge");


            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.BadgeId).HasColumnName("badge_id");

            entity.Property(e => e.EarnedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("earned_at");


            entity.HasOne(d => d.Badge)
                .WithMany(p => p.UserBadges)
                .HasForeignKey(d => d.BadgeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserBadge__badge__5DCAEF64");
            entity.HasOne(d => d.User)
                .WithMany(p => p.UserBadges)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserBadge__user___5CD6CB2B");
            OnModelCreatingPartial(modelBuilder);
        });
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
