using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSpport.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Badge",
                columns: table => new
                {
                    badge_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    icon_url = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Badge__E79896563A608AAD", x => x.badge_id);
                });

            migrationBuilder.CreateTable(
                name: "GoalTemplate",
                columns: table => new
                {
                    template_id = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GoalTemp__BE44E0792304EE26", x => x.template_id);
                });

            migrationBuilder.CreateTable(
                name: "TriggerFactor",
                columns: table => new
                {
                    trigger_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TriggerF__23E04327247944B7", x => x.trigger_id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    username = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    password_hash = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    display_name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    user_type = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    avatar_url = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__B9BE370F799BEE66", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "AdminProfile",
                columns: table => new
                {
                    admin_id = table.Column<int>(type: "int", nullable: false),
                    permission_level = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AdminPro__43AA41410C9FD967", x => x.admin_id);
                    table.ForeignKey(
                        name: "FK__AdminProf__admin__59FA5E80",
                        column: x => x.admin_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "ChatMessage",
                columns: table => new
                {
                    message_id = table.Column<int>(type: "int", nullable: false),
                    sender_id = table.Column<int>(type: "int", nullable: true),
                    receiver_id = table.Column<int>(type: "int", nullable: true),
                    content = table.Column<string>(type: "text", nullable: true),
                    sent_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    is_read = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChatMess__0BBF6EE6E8C99D4E", x => x.message_id);
                    table.ForeignKey(
                        name: "FK__ChatMessa__recei__412EB0B6",
                        column: x => x.receiver_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "FK__ChatMessa__sende__403A8C7D",
                        column: x => x.sender_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "CoachProfile",
                columns: table => new
                {
                    coach_id = table.Column<int>(type: "int", nullable: false),
                    specialization = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CoachPro__2BEBE0446593A253", x => x.coach_id);
                    table.ForeignKey(
                        name: "FK__CoachProf__coach__29572725",
                        column: x => x.coach_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    feedback_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    type = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    content = table.Column<string>(type: "text", nullable: true),
                    submitted_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__7A6B2B8CF55D8B2F", x => x.feedback_id);
                    table.ForeignKey(
                        name: "FK__Feedback__user_i__4E88ABD4",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "MemberProfile",
                columns: table => new
                {
                    member_id = table.Column<int>(type: "int", nullable: false),
                    smoking_status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    quit_attempts = table.Column<int>(type: "int", nullable: true),
                    experience_level = table.Column<int>(type: "int", nullable: true),
                    previous_attempts = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MemberPr__B29B85346B6BE499", x => x.member_id);
                    table.ForeignKey(
                        name: "FK__MemberPro__membe__267ABA7A",
                        column: x => x.member_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Ranking",
                columns: table => new
                {
                    ranking_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    score = table.Column<int>(type: "int", nullable: true),
                    last_updated = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Ranking__95F5B23D5BE08871", x => x.ranking_id);
                    table.ForeignKey(
                        name: "FK__Ranking__user_id__5165187F",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "SystemReport",
                columns: table => new
                {
                    report_id = table.Column<int>(type: "int", nullable: false),
                    reporter_id = table.Column<int>(type: "int", nullable: true),
                    report_type = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    reported_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    details = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SystemRe__779B7C58BB933226", x => x.report_id);
                    table.ForeignKey(
                        name: "FK__SystemRep__repor__5CD6CB2B",
                        column: x => x.reporter_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "UserBadge",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false),
                    badge_id = table.Column<int>(type: "int", nullable: false),
                    earned_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserBadg__C7C7BE6AD6279876", x => new { x.user_id, x.badge_id });
                    table.ForeignKey(
                        name: "FK__UserBadge__badge__571DF1D5",
                        column: x => x.badge_id,
                        principalTable: "Badge",
                        principalColumn: "badge_id");
                    table.ForeignKey(
                        name: "FK__UserBadge__user___5629CD9C",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    appointment_id = table.Column<int>(type: "int", nullable: false),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    coach_id = table.Column<int>(type: "int", nullable: true),
                    start_time = table.Column<DateTime>(type: "datetime", nullable: true),
                    end_time = table.Column<DateTime>(type: "datetime", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Appointm__A50828FC397F9EE6", x => x.appointment_id);
                    table.ForeignKey(
                        name: "FK__Appointme__coach__44FF419A",
                        column: x => x.coach_id,
                        principalTable: "CoachProfile",
                        principalColumn: "coach_id");
                    table.ForeignKey(
                        name: "FK__Appointme__membe__440B1D61",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateTable(
                name: "CommunityPost",
                columns: table => new
                {
                    post_id = table.Column<int>(type: "int", nullable: false),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    content = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Communit__3ED78766740666E6", x => x.post_id);
                    table.ForeignKey(
                        name: "FK__Community__membe__47DBAE45",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateTable(
                name: "GoalPlan",
                columns: table => new
                {
                    plan_id = table.Column<int>(type: "int", nullable: false),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    target_quit_date = table.Column<DateOnly>(type: "date", nullable: true),
                    personal_motivation = table.Column<string>(type: "text", nullable: true),
                    use_template = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GoalPlan__BE9F8F1DDA1BB507", x => x.plan_id);
                    table.ForeignKey(
                        name: "FK__GoalPlan__member__2E1BDC42",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateTable(
                name: "MemberTrigger",
                columns: table => new
                {
                    member_trigger_id = table.Column<int>(type: "int", nullable: false),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    trigger_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MemberTr__7D57174CFAE3EE99", x => x.member_trigger_id);
                    table.ForeignKey(
                        name: "FK__MemberTri__membe__36B12243",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                    table.ForeignKey(
                        name: "FK__MemberTri__trigg__37A5467C",
                        column: x => x.trigger_id,
                        principalTable: "TriggerFactor",
                        principalColumn: "trigger_id");
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    notification_id = table.Column<int>(type: "int", nullable: false),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    content = table.Column<string>(type: "text", nullable: true),
                    type = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    is_read = table.Column<bool>(type: "bit", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Notifica__E059842F75703874", x => x.notification_id);
                    table.ForeignKey(
                        name: "FK__Notificat__membe__3D5E1FD2",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateTable(
                name: "ProgressLog",
                columns: table => new
                {
                    log_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    member_id = table.Column<int>(type: "int", nullable: false),
                    log_date = table.Column<DateOnly>(type: "date", nullable: false),
                    cigarettes_smoked = table.Column<int>(type: "int", nullable: false),
                    mood = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    trigger = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    MemberProfileMemberId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Progress__9E2397E0E66BFCF8", x => x.log_id);
                    table.ForeignKey(
                        name: "FK_ProgressLog_MemberProfile",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProgressLog_MemberProfile_MemberProfileMemberId",
                        column: x => x.MemberProfileMemberId,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateTable(
                name: "CommunityInteraction",
                columns: table => new
                {
                    interaction_id = table.Column<int>(type: "int", nullable: false),
                    post_id = table.Column<int>(type: "int", nullable: true),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    comment_content = table.Column<string>(type: "text", nullable: true),
                    commented_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Communit__605F8FE61AB23251", x => x.interaction_id);
                    table.ForeignKey(
                        name: "FK__Community__post___4AB81AF0",
                        column: x => x.post_id,
                        principalTable: "CommunityPost",
                        principalColumn: "post_id");
                    table.ForeignKey(
                        name: "FK__Community__user___4BAC3F29",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "MemberGoal",
                columns: table => new
                {
                    member_goal_id = table.Column<int>(type: "int", nullable: false),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    goal_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MemberGo__378ADBCE73D40F33", x => x.member_goal_id);
                    table.ForeignKey(
                        name: "FK__MemberGoa__goal___31EC6D26",
                        column: x => x.goal_id,
                        principalTable: "GoalPlan",
                        principalColumn: "plan_id");
                    table.ForeignKey(
                        name: "FK__MemberGoa__membe__30F848ED",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_coach_id",
                table: "Appointment",
                column: "coach_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_member_id",
                table: "Appointment",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessage_receiver_id",
                table: "ChatMessage",
                column: "receiver_id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessage_sender_id",
                table: "ChatMessage",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityInteraction_post_id",
                table: "CommunityInteraction",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityInteraction_user_id",
                table: "CommunityInteraction",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityPost_member_id",
                table: "CommunityPost",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_user_id",
                table: "Feedback",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_MemberGoal_goal_id",
                table: "MemberGoal",
                column: "goal_id");

            migrationBuilder.CreateIndex(
                name: "IX_MemberGoal_member_id",
                table: "MemberGoal",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_MemberTrigger_member_id",
                table: "MemberTrigger",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_MemberTrigger_trigger_id",
                table: "MemberTrigger",
                column: "trigger_id");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_member_id",
                table: "Notification",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_MemberProfileMemberId",
                table: "ProgressLog",
                column: "MemberProfileMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Ranking_user_id",
                table: "Ranking",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_SystemReport_reporter_id",
                table: "SystemReport",
                column: "reporter_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserBadge_badge_id",
                table: "UserBadge",
                column: "badge_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminProfile");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "ChatMessage");

            migrationBuilder.DropTable(
                name: "CommunityInteraction");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "GoalTemplate");

            migrationBuilder.DropTable(
                name: "MemberGoal");

            migrationBuilder.DropTable(
                name: "MemberTrigger");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "ProgressLog");

            migrationBuilder.DropTable(
                name: "Ranking");

            migrationBuilder.DropTable(
                name: "SystemReport");

            migrationBuilder.DropTable(
                name: "UserBadge");

            migrationBuilder.DropTable(
                name: "CoachProfile");

            migrationBuilder.DropTable(
                name: "CommunityPost");

            migrationBuilder.DropTable(
                name: "GoalPlan");

            migrationBuilder.DropTable(
                name: "TriggerFactor");

            migrationBuilder.DropTable(
                name: "Badge");

            migrationBuilder.DropTable(
                name: "MemberProfile");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
