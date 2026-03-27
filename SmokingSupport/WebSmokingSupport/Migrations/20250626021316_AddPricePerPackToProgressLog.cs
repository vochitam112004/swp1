using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddPricePerPackToProgressLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "title",
                table: "CommunityPost",
                newName: "Title");

            migrationBuilder.AddColumn<decimal>(
                name: "PricePerPack",
                table: "ProgressLog",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PricePerPack",
                table: "ProgressLog");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "CommunityPost",
                newName: "title");
        }
    }
}
