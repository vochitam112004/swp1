using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class FixMembershipPlanRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MembershipPlanPlanId",
                table: "UserMembershipHistories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipHistories_MembershipPlanPlanId",
                table: "UserMembershipHistories",
                column: "MembershipPlanPlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipHistories_MembershipPlans_MembershipPlanPlanId",
                table: "UserMembershipHistories",
                column: "MembershipPlanPlanId",
                principalTable: "MembershipPlans",
                principalColumn: "PlanId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipHistories_MembershipPlans_MembershipPlanPlanId",
                table: "UserMembershipHistories");

            migrationBuilder.DropIndex(
                name: "IX_UserMembershipHistories_MembershipPlanPlanId",
                table: "UserMembershipHistories");

            migrationBuilder.DropColumn(
                name: "MembershipPlanPlanId",
                table: "UserMembershipHistories");
        }
    }
}
