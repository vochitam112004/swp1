using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class Casede9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WeeklyReductionId",
                table: "GoalPlanWeeklyReduction",
                newName: "weekly_reduction_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "weekly_reduction_id",
                table: "GoalPlanWeeklyReduction",
                newName: "WeeklyReductionId");
        }
    }
}
