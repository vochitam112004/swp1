using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class fixKeyFore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "MembershipPlans",
                newName: "price");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "MembershipPlans",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "MembershipPlans",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "MembershipPlans",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "DurationDays",
                table: "MembershipPlans",
                newName: "duration_days");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "MembershipPlans",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "PlanId",
                table: "MembershipPlans",
                newName: "plan_id");

            migrationBuilder.AlterColumn<int>(
                name: "PlanId",
                table: "UserMembershipHistories",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "MembershipPlans",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "MembershipPlans",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "updated_at",
                table: "MembershipPlans",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "MembershipPlans",
                type: "datetime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "price",
                table: "MembershipPlans",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "MembershipPlans",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "MembershipPlans",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "MembershipPlans",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "duration_days",
                table: "MembershipPlans",
                newName: "DurationDays");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "MembershipPlans",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "plan_id",
                table: "MembershipPlans",
                newName: "PlanId");

            migrationBuilder.AlterColumn<int>(
                name: "PlanId",
                table: "UserMembershipHistories",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "MembershipPlans",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "MembershipPlans",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "MembershipPlans",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "MembershipPlans",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldDefaultValueSql: "GETUTCDATE()");
        }
    }
}
