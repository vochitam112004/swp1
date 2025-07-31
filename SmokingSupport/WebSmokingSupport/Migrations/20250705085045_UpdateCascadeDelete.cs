using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipHistories_User_UserId",
                table: "UserMembershipHistories");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipHistories_User_UserId",
                table: "UserMembershipHistories",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipHistories_User_UserId",
                table: "UserMembershipHistories");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipHistories_User_UserId",
                table: "UserMembershipHistories",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
