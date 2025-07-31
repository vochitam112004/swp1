using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class PayMentHistoryPlanPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
             name: "FK_CommunityPost_User",
            table: "CommunityPost");

           

            migrationBuilder.CreateTable(
                name: "MembershipPlans",
                columns: table => new
                {
                    PlanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationDays = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MembershipPlans", x => x.PlanId);
                });

            migrationBuilder.CreateTable(
                name: "UserMembershipHistories",
                columns: table => new
                {
                    HistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PlanId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    //MembershipPlanPlanId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMembershipHistories", x => x.HistoryId);
                    table.ForeignKey(
                        name: "FK_UserMembershipHistories_MembershipPlans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "MembershipPlans",
                        principalColumn: "PlanId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserMembershipHistories_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
       name: "UserMembershipPayments",
       columns: table => new
       {
           PaymentId = table.Column<int>(type: "int", nullable: false)
               .Annotation("SqlServer:Identity", "1, 1"),
           UserId = table.Column<int>(type: "int", nullable: false),
           PlanId = table.Column<int>(type: "int", nullable: false),
           PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
           ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
           Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
           PaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
           TransactionId = table.Column<string>(type: "nvarchar(max)", nullable: true)
       },
       constraints: table =>
       {
           table.PrimaryKey("PK_UserMembershipPayments", x => x.PaymentId);
           table.ForeignKey(
               name: "FK_UserMembershipPayments_MembershipPlans_PlanId",
               column: x => x.PlanId,
               principalTable: "MembershipPlans",
               principalColumn: "PlanId",
               onDelete: ReferentialAction.Restrict);
           table.ForeignKey(
               name: "FK_UserMembershipPayments_User_UserId",
               column: x => x.UserId,
               principalTable: "User",
               principalColumn: "user_id",
               onDelete: ReferentialAction.Restrict);
       });

            // Indexes
            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipHistories_PlanId",
                table: "UserMembershipHistories",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipHistories_UserId",
                table: "UserMembershipHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipPayments_PlanId",
                table: "UserMembershipPayments",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipPayments_UserId",
                table: "UserMembershipPayments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserMembershipHistories");

            migrationBuilder.DropTable(
                name: "UserMembershipPayments");

            migrationBuilder.DropTable(
                name: "MembershipPlans");

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
        }
    }
}
