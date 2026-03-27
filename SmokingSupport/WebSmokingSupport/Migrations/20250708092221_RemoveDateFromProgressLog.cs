using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDateFromProgressLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id_Date",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "ProgressLog");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "log_date",
                table: "ProgressLog",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog",
                columns: new[] { "member_id", "log_date" },
                unique: true,
                filter: "[member_id] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "log_date",
                table: "ProgressLog",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "ProgressLog",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id_Date",
                table: "ProgressLog",
                columns: new[] { "member_id", "Date" },
                unique: true,
                filter: "[member_id] IS NOT NULL");
        }
    }
}
