using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class onetoone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
