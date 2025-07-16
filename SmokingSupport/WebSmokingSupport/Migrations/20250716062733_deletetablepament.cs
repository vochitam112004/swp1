using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class deletetablepament : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserMembershipHistories");

            migrationBuilder.DropTable(
                name: "UserMembershipPayments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserMembershipHistories",
                columns: table => new
                {
                    HistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMembershipHistories", x => x.HistoryId);
                    table.ForeignKey(
                        name: "FK_UserMembershipHistories_MembershipPlans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "MembershipPlans",
                        principalColumn: "plan_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMembershipHistories_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserMembershipPayments",
                columns: table => new
                {
                    payment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    plan_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    expiration_date = table.Column<DateTime>(type: "datetime", nullable: false),
                    payment_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    payment_status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    transaction_id = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMembershipPayments", x => x.payment_id);
                    table.ForeignKey(
                        name: "FK_UserMembershipPayments_MembershipPlans_plan_id",
                        column: x => x.plan_id,
                        principalTable: "MembershipPlans",
                        principalColumn: "plan_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserMembershipPayments_User_user_id",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipHistories_PlanId",
                table: "UserMembershipHistories",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipHistories_UserId",
                table: "UserMembershipHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipPayments_plan_id",
                table: "UserMembershipPayments",
                column: "plan_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserMembershipPayments_user_id",
                table: "UserMembershipPayments",
                column: "user_id");
        }
    }
}
