using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class updateProgressLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalPlan_ProgressLog_ProgressLogLogId",
                table: "GoalPlan");

            migrationBuilder.DropIndex(
                name: "IX_GoalPlan_ProgressLogLogId",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "ProgressLogLogId",
                table: "GoalPlan");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "ProgressLog",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "GoalPlanId",
                table: "ProgressLog",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_GoalPlanId",
                table: "ProgressLog",
                column: "GoalPlanId",
                unique: true,
                filter: "[GoalPlanId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id_Date",
                table: "ProgressLog",
                columns: new[] { "member_id", "Date" },
                unique: true,
                filter: "[member_id] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_GoalPlanId",
                table: "ProgressLog",
                column: "GoalPlanId",
                principalTable: "GoalPlan",
                principalColumn: "plan_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id_Date",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "GoalPlanId",
                table: "ProgressLog");

            migrationBuilder.AddColumn<int>(
                name: "ProgressLogLogId",
                table: "GoalPlan",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GoalPlan_ProgressLogLogId",
                table: "GoalPlan",
                column: "ProgressLogLogId");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalPlan_ProgressLog_ProgressLogLogId",
                table: "GoalPlan",
                column: "ProgressLogLogId",
                principalTable: "ProgressLog",
                principalColumn: "log_id");
        }
    }
}
