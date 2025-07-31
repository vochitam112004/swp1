using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class relision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.DropForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.AddColumn<int>(
                name: "ProgressLogLogId",
                table: "GoalPlan",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isCurrentGoal",
                table: "GoalPlan",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog",
                column: "member_id",
                unique: true,
                filter: "[member_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_ProgressLogLogId",
                table: "GoalPlan",
                column: "ProgressLogLogId");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalPlan_ProgressLog_ProgressLogLogId",
                table: "GoalPlan",
                column: "ProgressLogLogId",
                principalTable: "ProgressLog",
                principalColumn: "log_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_ProgressLog_ProgressLogLogId",
                table: "GoalPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_ProgressLogLogId",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "ProgressLogLogId",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "isCurrentGoal",
                table: "GoalPlan");

            migrationBuilder.AddColumn<int>(
                name: "GoalPlanId",
                table: "ProgressLog",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_GoalPlanId",
                table: "ProgressLog",
                column: "GoalPlanId",
                unique: true,
                filter: "[GoalPlanId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id",
                table: "ProgressLog",
                column: "member_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_GoalPlanId",
                table: "ProgressLog",
                column: "GoalPlanId",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }
    }
}
