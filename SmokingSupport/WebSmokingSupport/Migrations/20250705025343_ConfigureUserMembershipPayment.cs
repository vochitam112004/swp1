using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureUserMembershipPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipPayments_MembershipPlans_PlanId",
                table: "UserMembershipPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipPayments_User_UserId",
                table: "UserMembershipPayments");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "UserMembershipPayments",
                newName: "amount");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserMembershipPayments",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "TransactionId",
                table: "UserMembershipPayments",
                newName: "transaction_id");

            migrationBuilder.RenameColumn(
                name: "PlanId",
                table: "UserMembershipPayments",
                newName: "plan_id");

            migrationBuilder.RenameColumn(
                name: "PaymentStatus",
                table: "UserMembershipPayments",
                newName: "payment_status");

            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "UserMembershipPayments",
                newName: "payment_date");

            migrationBuilder.RenameColumn(
                name: "ExpirationDate",
                table: "UserMembershipPayments",
                newName: "expiration_date");

            migrationBuilder.RenameColumn(
                name: "PaymentId",
                table: "UserMembershipPayments",
                newName: "payment_id");

            migrationBuilder.RenameIndex(
                name: "IX_UserMembershipPayments_UserId",
                table: "UserMembershipPayments",
                newName: "IX_UserMembershipPayments_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_UserMembershipPayments_PlanId",
                table: "UserMembershipPayments",
                newName: "IX_UserMembershipPayments_plan_id");

            migrationBuilder.AlterColumn<string>(
                name: "transaction_id",
                table: "UserMembershipPayments",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "payment_status",
                table: "UserMembershipPayments",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "payment_date",
                table: "UserMembershipPayments",
                type: "datetime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "expiration_date",
                table: "UserMembershipPayments",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipPayments_MembershipPlans_plan_id",
                table: "UserMembershipPayments",
                column: "plan_id",
                principalTable: "MembershipPlans",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipPayments_User_user_id",
                table: "UserMembershipPayments",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipPayments_MembershipPlans_plan_id",
                table: "UserMembershipPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMembershipPayments_User_user_id",
                table: "UserMembershipPayments");

            migrationBuilder.RenameColumn(
                name: "amount",
                table: "UserMembershipPayments",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "UserMembershipPayments",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "transaction_id",
                table: "UserMembershipPayments",
                newName: "TransactionId");

            migrationBuilder.RenameColumn(
                name: "plan_id",
                table: "UserMembershipPayments",
                newName: "PlanId");

            migrationBuilder.RenameColumn(
                name: "payment_status",
                table: "UserMembershipPayments",
                newName: "PaymentStatus");

            migrationBuilder.RenameColumn(
                name: "payment_date",
                table: "UserMembershipPayments",
                newName: "PaymentDate");

            migrationBuilder.RenameColumn(
                name: "expiration_date",
                table: "UserMembershipPayments",
                newName: "ExpirationDate");

            migrationBuilder.RenameColumn(
                name: "payment_id",
                table: "UserMembershipPayments",
                newName: "PaymentId");

            migrationBuilder.RenameIndex(
                name: "IX_UserMembershipPayments_user_id",
                table: "UserMembershipPayments",
                newName: "IX_UserMembershipPayments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserMembershipPayments_plan_id",
                table: "UserMembershipPayments",
                newName: "IX_UserMembershipPayments_PlanId");

            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "UserMembershipPayments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldUnicode: false,
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentStatus",
                table: "UserMembershipPayments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaymentDate",
                table: "UserMembershipPayments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ExpirationDate",
                table: "UserMembershipPayments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipPayments_MembershipPlans_PlanId",
                table: "UserMembershipPayments",
                column: "PlanId",
                principalTable: "MembershipPlans",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMembershipPayments_User_UserId",
                table: "UserMembershipPayments",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
