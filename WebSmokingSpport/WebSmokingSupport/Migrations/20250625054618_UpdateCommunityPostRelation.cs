using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCommunityPostRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Community__membe__4BAC3F29",
                table: "CommunityPost");

            migrationBuilder.RenameColumn(
                name: "member_id",
                table: "CommunityPost",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_CommunityPost_member_id",
                table: "CommunityPost",
                newName: "IX_CommunityPost_user_id");

            migrationBuilder.AddColumn<int>(
                name: "MemberProfileMemberId",
                table: "CommunityPost",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommunityPost_MemberProfileMemberId",
                table: "CommunityPost",
                column: "MemberProfileMemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommunityPost_MemberProfile_MemberProfileMemberId",
                table: "CommunityPost",
                column: "MemberProfileMemberId",
                principalTable: "MemberProfile",
                principalColumn: "member_id");

            migrationBuilder.AddForeignKey(
                name: "FK_CommunityPost_User",
                table: "CommunityPost",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommunityPost_MemberProfile_MemberProfileMemberId",
                table: "CommunityPost");

            migrationBuilder.DropForeignKey(
                name: "FK_CommunityPost_User",
                table: "CommunityPost");

            migrationBuilder.DropIndex(
                name: "IX_CommunityPost_MemberProfileMemberId",
                table: "CommunityPost");

            migrationBuilder.DropColumn(
                name: "MemberProfileMemberId",
                table: "CommunityPost");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "CommunityPost",
                newName: "member_id");

            migrationBuilder.RenameIndex(
                name: "IX_CommunityPost_user_id",
                table: "CommunityPost",
                newName: "IX_CommunityPost_member_id");

            migrationBuilder.AddForeignKey(
                name: "FK__Community__membe__4BAC3F29",
                table: "CommunityPost",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }
    }
}
