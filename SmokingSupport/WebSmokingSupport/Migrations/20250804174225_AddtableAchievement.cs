using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddtableAchievement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "cigarettes_reduced",
                table: "GoalPlanWeeklyReduction",
                newName: "total_cigarettes");

            migrationBuilder.CreateTable(
                name: "UserAchievement",
                columns: table => new
                {
                    AchievementId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SmokeFreeDays = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAchievement", x => x.AchievementId);
                    table.ForeignKey(
                        name: "FK_UserAchievement_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievement_UserId",
                table: "UserAchievement",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAchievement");

            migrationBuilder.RenameColumn(
                name: "total_cigarettes",
                table: "GoalPlanWeeklyReduction",
                newName: "cigarettes_reduced");
        }
    }
}
