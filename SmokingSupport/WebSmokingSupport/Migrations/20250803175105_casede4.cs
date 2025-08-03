using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class casede4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog");

            migrationBuilder.RenameColumn(
                name: "member_id",
                table: "ProgressLog",
                newName: "MemberId");

            migrationBuilder.AlterColumn<int>(
                name: "goal_plan_id",
                table: "ProgressLog",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_MemberId",
                table: "ProgressLog",
                column: "MemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_MemberProfile_MemberId",
                table: "ProgressLog",
                column: "MemberId",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgressLog_MemberProfile_MemberId",
                table: "ProgressLog");

            migrationBuilder.DropIndex(
                name: "IX_ProgressLog_MemberId",
                table: "ProgressLog");

            migrationBuilder.RenameColumn(
                name: "MemberId",
                table: "ProgressLog",
                newName: "member_id");

            migrationBuilder.AlterColumn<int>(
                name: "goal_plan_id",
                table: "ProgressLog",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressLog_member_id_log_date",
                table: "ProgressLog",
                columns: new[] { "member_id", "log_date" });

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_GoalPlan_goal_plan_id",
                table: "ProgressLog",
                column: "goal_plan_id",
                principalTable: "GoalPlan",
                principalColumn: "plan_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressLog_MemberProfile_member_id",
                table: "ProgressLog",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }
    }
}
