using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToMemberProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__MemberPro__membe__286302EC",
                table: "MemberProfile");

            migrationBuilder.RenameColumn(
                name: "PricePerPack",
                table: "ProgressLog",
                newName: "price_per_pack");

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "MemberProfile",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MemberProfile_user_id",
                table: "MemberProfile",
                column: "user_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK__MemberPro__membe__286302EC",
                table: "MemberProfile",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__MemberPro__membe__286302EC",
                table: "MemberProfile");

            migrationBuilder.DropIndex(
                name: "IX_MemberProfile_user_id",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "MemberProfile");

            migrationBuilder.RenameColumn(
                name: "price_per_pack",
                table: "ProgressLog",
                newName: "PricePerPack");


            migrationBuilder.AddForeignKey(
                name: "FK__MemberPro__membe__286302EC",
                table: "MemberProfile",
                column: "member_id",
                principalTable: "User",
                principalColumn: "user_id");
        }
    }
}
