using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class ResolveMultipleCascadePaths : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__MemberPro__membe__286302EC",
                table: "MemberProfile");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog");

            migrationBuilder.RenameColumn(
                name: "GoalPlanId",
                table: "ProgressLog",
                newName: "goal_plan_id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "MemberProfile",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "smoking_status",
                table: "MemberProfile",
                newName: "SmokingStatus");

            migrationBuilder.RenameColumn(
                name: "quit_attempts",
                table: "MemberProfile",
                newName: "QuitAttempts");

            migrationBuilder.RenameColumn(
                name: "previous_attempts",
                table: "MemberProfile",
                newName: "PreviousAttempts");

            migrationBuilder.RenameColumn(
                name: "experience_level",
                table: "MemberProfile",
                newName: "ExperienceLevel");

            migrationBuilder.RenameIndex(
                name: "IX_MemberProfile_user_id",
                table: "MemberProfile",
                newName: "IX_MemberProfile_UserId");

            migrationBuilder.RenameColumn(
                name: "use_template",
                table: "GoalPlan",
                newName: "UseTemplate");

            migrationBuilder.RenameColumn(
                name: "target_quit_date",
                table: "GoalPlan",
                newName: "TargetQuitDate");

            migrationBuilder.RenameColumn(
                name: "start_date",
                table: "GoalPlan",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "personal_motivation",
                table: "GoalPlan",
                newName: "PersonalMotivation");

            migrationBuilder.AlterColumn<string>(
                name: "SmokingStatus",
                table: "MemberProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreviousAttempts",
                table: "MemberProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PersonalMotivation",
                table: "GoalPlan",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MemberProfileMemberId",
                table: "GoalPlan",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id");

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_MemberProfileMemberId",
                table: "GoalPlan",
                column: "MemberProfileMemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalPlan_MemberProfile_MemberProfileMemberId",
                table: "GoalPlan",
                column: "MemberProfileMemberId",
                principalTable: "MemberProfile",
                principalColumn: "member_id");

            migrationBuilder.AddForeignKey(
                name: "FK__MemberPro__user__286302EC",
                table: "MemberProfile",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_MemberProfile_MemberProfileMemberId",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK__MemberPro__user__286302EC",
                table: "MemberProfile");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_MemberProfileMemberId",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "MemberProfileMemberId",
                table: "GoalPlan");

            migrationBuilder.RenameColumn(
                name: "goal_plan_id",
                table: "ProgressLog",
                newName: "GoalPlanId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "MemberProfile",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "SmokingStatus",
                table: "MemberProfile",
                newName: "smoking_status");

            migrationBuilder.RenameColumn(
                name: "QuitAttempts",
                table: "MemberProfile",
                newName: "quit_attempts");

            migrationBuilder.RenameColumn(
                name: "PreviousAttempts",
                table: "MemberProfile",
                newName: "previous_attempts");

            migrationBuilder.RenameColumn(
                name: "ExperienceLevel",
                table: "MemberProfile",
                newName: "experience_level");

            migrationBuilder.RenameIndex(
                name: "IX_MemberProfile_UserId",
                table: "MemberProfile",
                newName: "IX_MemberProfile_user_id");

            migrationBuilder.RenameColumn(
                name: "UseTemplate",
                table: "GoalPlan",
                newName: "use_template");

            migrationBuilder.RenameColumn(
                name: "TargetQuitDate",
                table: "GoalPlan",
                newName: "target_quit_date");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "GoalPlan",
                newName: "start_date");

            migrationBuilder.RenameColumn(
                name: "PersonalMotivation",
                table: "GoalPlan",
                newName: "personal_motivation");

            migrationBuilder.AlterColumn<string>(
                name: "smoking_status",
                table: "MemberProfile",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "previous_attempts",
                table: "MemberProfile",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "personal_motivation",
                table: "GoalPlan",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_GoalPlanId",
                table: "ProgressLog",
                column: "GoalPlanId",
                unique: true,
                filter: "[GoalPlanId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog",
                column: "member_id",
                unique: true,
                filter: "[member_id] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK__MemberPro__membe__286302EC",
                table: "MemberProfile",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_GoalPlanId",
                table: "ProgressLog",
                column: "GoalPlanId",
                principalTable: "GoalPlan",
                principalColumn: "plan_id");
        }
    }
}
