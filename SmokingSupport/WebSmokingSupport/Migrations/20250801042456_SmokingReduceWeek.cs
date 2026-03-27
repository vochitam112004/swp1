using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class SmokingReduceWeek : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Appointme__membe__46E78A0C",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "cigarettes_smoked",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "price_per_pack",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "DurationInDays",
                table: "MembershipPlans");

            migrationBuilder.DropColumn(
                name: "PreviousAttempts",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "SmokingStatus",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "personal_motivation",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "target_quit_date",
                table: "GoalPlan");

            migrationBuilder.RenameColumn(
                name: "mood",
                table: "ProgressLog",
                newName: "Mood");

            migrationBuilder.AlterColumn<string>(
                name: "Mood",
                table: "ProgressLog",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "cigarettes_per_pack",
                table: "ProgressLog",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Symptoms",
                table: "ProgressLog",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Triggers",
                table: "ProgressLog",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CigarettesPerPack",
                table: "MemberProfile",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CigarettesSmoked",
                table: "MemberProfile",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "health",
                table: "MemberProfile",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "personal_motivation",
                table: "MemberProfile",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "price_per_pack",
                table: "MemberProfile",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "start_date",
                table: "GoalPlan",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "member_id",
                table: "GoalPlan",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "is_current_goal",
                table: "GoalPlan",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalDays",
                table: "GoalPlan",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateOnly>(
                name: "end_date",
                table: "GoalPlan",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Appointment",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_UserId",
                table: "Appointment",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_MemberProfile_member_id",
                table: "Appointment",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_User_UserId",
                table: "Appointment",
                column: "UserId",
                principalTable: "User",
                principalColumn: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_MemberProfile_member_id",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_User_UserId",
                table: "Appointment");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_UserId",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "Symptoms",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "Triggers",
                table: "ProgressLog");

            migrationBuilder.DropColumn(
                name: "CigarettesPerPack",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "CigarettesSmoked",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "health",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "personal_motivation",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "price_per_pack",
                table: "MemberProfile");

            migrationBuilder.DropColumn(
                name: "TotalDays",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "end_date",
                table: "GoalPlan");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Appointment");

            migrationBuilder.RenameColumn(
                name: "Mood",
                table: "ProgressLog",
                newName: "mood");

            migrationBuilder.AlterColumn<int>(
                name: "cigarettes_per_pack",
                table: "ProgressLog",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "mood",
                table: "ProgressLog",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "cigarettes_smoked",
                table: "ProgressLog",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "price_per_pack",
                table: "ProgressLog",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DurationInDays",
                table: "MembershipPlans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PreviousAttempts",
                table: "MemberProfile",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SmokingStatus",
                table: "MemberProfile",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "start_date",
                table: "GoalPlan",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<int>(
                name: "member_id",
                table: "GoalPlan",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "is_current_goal",
                table: "GoalPlan",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "personal_motivation",
                table: "GoalPlan",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "target_quit_date",
                table: "GoalPlan",
                type: "date",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK__Appointme__membe__46E78A0C",
                table: "Appointment",
                column: "member_id",
                principalTable: "MemberProfile",
                principalColumn: "member_id");
        }
    }
}
