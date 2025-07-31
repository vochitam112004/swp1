using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class a1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "trigger",
                table: "ProgressLog");

            migrationBuilder.AddColumn<int>(
                name: "cigarettes_per_pack",
                table: "ProgressLog",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "ProgressLog",
                type: "datetime",
                nullable: true,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "ProgressLog",
                type: "datetime",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan",
                column: "member_id",
                unique: true,
                filter: "[member_id] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "cigarettes_per_pack",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "ProgressLog");

            migrationBuilder.AddColumn<string>(
                name: "trigger",
                table: "ProgressLog",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_member_id",
                table: "GoalPlan",
                column: "member_id");
        }
    }
}
