using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class CaseComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Community__post___4F7CD00D",
                table: "CommunityInteraction");

            migrationBuilder.AddForeignKey(
                name: "FK__Community__post___4F7CD00D",
                table: "CommunityInteraction",
                column: "post_id",
                principalTable: "CommunityPost",
                principalColumn: "post_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Community__post___4F7CD00D",
                table: "CommunityInteraction");

            migrationBuilder.AddForeignKey(
                name: "FK__Community__post___4F7CD00D",
                table: "CommunityInteraction",
                column: "post_id",
                principalTable: "CommunityPost",
                principalColumn: "post_id");
        }
    }
}
