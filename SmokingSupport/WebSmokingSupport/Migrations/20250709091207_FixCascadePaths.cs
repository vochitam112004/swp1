using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadePaths : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
