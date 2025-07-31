using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSmokingSupport.Migrations
{
    /// <inheritdoc />
    public partial class deleteMemberGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminProfile");

            migrationBuilder.DropTable(
                name: "GoalTemplate");

            migrationBuilder.DropTable(
                name: "MemberGoal");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminProfile",
                columns: table => new
                {
                    admin_id = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    permission_level = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AdminPro__43AA4141CBF17DDA", x => x.admin_id);
                    table.ForeignKey(
                        name: "FK__AdminProf__admin__60A75C0F",
                        column: x => x.admin_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GoalTemplate",
                columns: table => new
                {
                    template_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GoalTemp__BE44E07923FB669E", x => x.template_id);
                });

            migrationBuilder.CreateTable(
                name: "MemberGoal",
                columns: table => new
                {
                    member_goal_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    goal_id = table.Column<int>(type: "int", nullable: true),
                    member_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MemberGo__378ADBCECEB612BF", x => x.member_goal_id);
                    table.ForeignKey(
                        name: "FK__MemberGoa__goal___33D4B598",
                        column: x => x.goal_id,
                        principalTable: "GoalPlan",
                        principalColumn: "plan_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__MemberGoa__membe__32E0915F",
                        column: x => x.member_id,
                        principalTable: "MemberProfile",
                        principalColumn: "member_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MemberGoal_goal_id",
                table: "MemberGoal",
                column: "goal_id");

            migrationBuilder.CreateIndex(
                name: "IX_MemberGoal_member_id",
                table: "MemberGoal",
                column: "member_id");
        }
    }
}
