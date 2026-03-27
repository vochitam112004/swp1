using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class casechat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ChatMessa__recei__440B1D61",
                table: "ChatMessage");

            migrationBuilder.AddForeignKey(
                name: "FK__ChatMessa__recei__440B1D61",
                table: "ChatMessage",
                column: "receiver_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ChatMessa__recei__440B1D61",
                table: "ChatMessage");

            migrationBuilder.AddForeignKey(
                name: "FK__ChatMessa__recei__440B1D61",
                table: "ChatMessage",
                column: "receiver_id",
                principalTable: "User",
                principalColumn: "user_id");
        }
    }
}
