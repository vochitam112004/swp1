using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAchievementTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAchievement_User_UserId",
                table: "UserAchievement");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAchievement",
                table: "UserAchievement");

            migrationBuilder.RenameTable(
                name: "UserAchievement",
                newName: "UserAchievements");

            migrationBuilder.RenameIndex(
                name: "IX_UserAchievement_UserId",
                table: "UserAchievements",
                newName: "IX_UserAchievements_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAchievements",
                table: "UserAchievements",
                column: "AchievementId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAchievements_User_UserId",
                table: "UserAchievements",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAchievements_User_UserId",
                table: "UserAchievements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAchievements",
                table: "UserAchievements");

            migrationBuilder.RenameTable(
                name: "UserAchievements",
                newName: "UserAchievement");

            migrationBuilder.RenameIndex(
                name: "IX_UserAchievements_UserId",
                table: "UserAchievement",
                newName: "IX_UserAchievement_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAchievement",
                table: "UserAchievement",
                column: "AchievementId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAchievement_User_UserId",
                table: "UserAchievement",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
