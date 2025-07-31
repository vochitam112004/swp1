using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGoalPlanSchemaRemoveCigaretteProps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_MemberProfile_MemberProfileMemberId",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK__MemberGoa__goal___33D4B598",
                table: "MemberGoal");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_member_id_isCurrentGoal",
                table: "GoalPlan");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_MemberProfileMemberId",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "MemberProfileMemberId",
                table: "GoalPlan");

            migrationBuilder.RenameColumn(
                name: "isCurrentGoal",
                table: "GoalPlan",
                newName: "is_current_goal");

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

            migrationBuilder.AlterColumn<bool>(
                name: "is_current_goal",
                table: "GoalPlan",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "personal_motivation",
                table: "GoalPlan",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "GoalPlan",
                type: "datetime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "GoalPlan",
                type: "datetime",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog",
                columns: new[] { "member_id", "log_date" });

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id_is_current_goal",
                table: "GoalPlan",
                columns: new[] { "member_id", "is_current_goal" },
                unique: true,
                filter: "[is_current_goal] = 1");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalPlan_MemberProfile_member_id",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK__MemberGoa__goal___33D4B598",
                table: "MemberGoal",
                column: "goal_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_MemberProfile_member_id",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK__MemberGoa__goal___33D4B598",
                table: "MemberGoal");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_member_id_is_current_goal",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "GoalPlan");

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

            migrationBuilder.RenameColumn(
                name: "is_current_goal",
                table: "GoalPlan",
                newName: "isCurrentGoal");

            migrationBuilder.AlterColumn<string>(
                name: "PersonalMotivation",
                table: "GoalPlan",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "isCurrentGoal",
                table: "GoalPlan",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "MemberProfileMemberId",
                table: "GoalPlan",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog",
                columns: new[] { "member_id", "log_date" },
                unique: true,
                filter: "[member_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan",
                column: "member_id",
                unique: true,
                filter: "[member_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id_isCurrentGoal",
                table: "GoalPlan",
                columns: new[] { "member_id", "isCurrentGoal" },
                unique: true,
                filter: "[isCurrentGoal] = 1");

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
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK__MemberGoa__goal___33D4B598",
                table: "MemberGoal",
                column: "goal_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id");
        }
    }
}
