using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class cascadeinProgressLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog");

            migrationBuilder.AddForeignKey(
                name: "FK__ProgressL__membe__3C69FB99",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }
    }
}
