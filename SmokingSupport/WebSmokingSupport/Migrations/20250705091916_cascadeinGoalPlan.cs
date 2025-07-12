using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class cascadeinGoalPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan");

            migrationBuilder.AddForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan");

            migrationBuilder.AddForeignKey(
                name: "FK__GoalPlan__member__300424B4",
                table: "GoalPlan",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }
    }
}
