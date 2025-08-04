using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGoalPlanProgressLogCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "cigarettes_per_pack",
                table: "ProgressLog",
                newName: "cigarettes_smoked");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "cigarettes_smoked",
                table: "ProgressLog",
                newName: "cigarettes_per_pack");
        }
    }
}
