using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGoalPlanDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id");
        }
    }
}
