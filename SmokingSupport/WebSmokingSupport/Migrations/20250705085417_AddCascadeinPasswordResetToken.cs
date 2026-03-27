using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeinPasswordResetToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__PasswordR__user___693CA210",
                table: "PasswordResetToken");

            migrationBuilder.AddForeignKey(
                name: "FK__PasswordR__user___693CA210",
                table: "PasswordResetToken",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__PasswordR__user___693CA210",
                table: "PasswordResetToken");

            migrationBuilder.AddForeignKey(
                name: "FK__PasswordR__user___693CA210",
                table: "PasswordResetToken",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id");
        }
    }
}
