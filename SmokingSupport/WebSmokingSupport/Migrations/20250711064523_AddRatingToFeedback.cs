using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingToFeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__AdminProf__admin__60A75C0F",
                table: "AdminProfile");

            migrationBuilder.DropForeignKey(
                name: "FK__CoachProf__coach__2B3F6F97",
                table: "CoachProfile");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "TriggerFactor",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TriggerFactor",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditedAt",
                table: "CommunityInteraction",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isEdit",
                table: "CommunityInteraction",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateAt",
                table: "CoachProfile",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "CoachProfile",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "AppointmentDate",
                table: "Appointment",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Appointment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingLink",
                table: "Appointment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Appointment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AdminProfile",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK__AdminProf__admin__60A75C0F",
                table: "AdminProfile",
                column: "admin_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__CoachProf__coach__2B3F6F97",
                table: "CoachProfile",
                column: "coach_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__AdminProf__admin__60A75C0F",
                table: "AdminProfile");

            migrationBuilder.DropForeignKey(
                name: "FK__CoachProf__coach__2B3F6F97",
                table: "CoachProfile");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "TriggerFactor");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TriggerFactor");

            migrationBuilder.DropColumn(
                name: "EditedAt",
                table: "CommunityInteraction");

            migrationBuilder.DropColumn(
                name: "isEdit",
                table: "CommunityInteraction");

            migrationBuilder.DropColumn(
                name: "CreateAt",
                table: "CoachProfile");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CoachProfile");

            migrationBuilder.DropColumn(
                name: "AppointmentDate",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "MeetingLink",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AdminProfile");

            migrationBuilder.AddForeignKey(
                name: "FK__AdminProf__admin__60A75C0F",
                table: "AdminProfile",
                column: "admin_id",
                principalTable: "User",
                principalColumn: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK__CoachProf__coach__2B3F6F97",
                table: "CoachProfile",
                column: "coach_id",
                principalTable: "User",
                principalColumn: "user_id");
        }
    }
}
