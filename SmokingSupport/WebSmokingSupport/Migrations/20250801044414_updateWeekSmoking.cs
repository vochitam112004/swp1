using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class updateWeekSmoking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GoalPlanWeeklyReduction",
                columns: table => new
                {
                    WeeklyReductionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    goal_plan_id = table.Column<int>(type: "int", nullable: false),
                    week_number = table.Column<int>(type: "int", nullable: false),
                    cigarettes_reduced = table.Column<int>(type: "int", nullable: false),
                    start_date = table.Column<DateTime>(type: "date", nullable: false),
                    end_date = table.Column<DateTime>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoalPlanWeeklyReduction", x => x.WeeklyReductionId);
                    table.ForeignKey(
                        name: "FK_GoalPlanWeeklyReduction_GoalPlan",
                        column: x => x.goal_plan_id,
                        principalTable: "GoalPlan",
                        principalColumn: "plan_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlanWeeklyReduction_goal_plan_id",
                table: "GoalPlanWeeklyReduction",
                column: "goal_plan_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GoalPlanWeeklyReduction");
        }
    }
}
