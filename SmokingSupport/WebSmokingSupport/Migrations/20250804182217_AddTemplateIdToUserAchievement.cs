using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateIdToUserAchievement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TemplateId",
                table: "UserAchievements",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AchievementTemplates",
                columns: table => new
                {
                    TemplateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiredSmokeFreeDays = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AchievementTemplates", x => x.TemplateId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievements_TemplateId",
                table: "UserAchievements",
                column: "TemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAchievements_AchievementTemplates_TemplateId",
                table: "UserAchievements",
                column: "TemplateId",
                principalTable: "AchievementTemplates",
                principalColumn: "TemplateId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAchievements_AchievementTemplates_TemplateId",
                table: "UserAchievements");

            migrationBuilder.DropTable(
                name: "AchievementTemplates");

            migrationBuilder.DropIndex(
                name: "IX_UserAchievements_TemplateId",
                table: "UserAchievements");

            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "UserAchievements");
        }
    }
}
