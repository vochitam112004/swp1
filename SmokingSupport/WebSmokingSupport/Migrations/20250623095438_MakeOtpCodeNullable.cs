using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class MakeOtpCodeNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
       

          

          
           

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
                name: "IX_PasswordResetToken_user_id",
                table: "PasswordResetToken",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog",
                column: "member_id");

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
          

        }
    }
}
