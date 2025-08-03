using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class Case : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_MemberProfile_member_id",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalPlan_MemberProfile_member_id",
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
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_MemberProfile_member_id",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalPlan_MemberProfile_member_id",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
