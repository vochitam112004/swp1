using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class isCurrentGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id_isCurrentGoal",
                table: "GoalPlan",
                columns: new[] { "member_id", "isCurrentGoal" },
                unique: true,
                filter: "[isCurrentGoal] = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_member_id_isCurrentGoal",
                table: "GoalPlan");
        }
    }
}
