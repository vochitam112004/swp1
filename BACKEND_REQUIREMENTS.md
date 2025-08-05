# Backend Requirements - Coach Trigger Factor Management

## Vấn đề hiện tại

Từ giao diện coach, tôi thấy:
- ✅ **Gán trigger factors** đã hoạt động (có thông báo "Đã gán 1 yếu tố kích thích cho Tu pro")
- ❌ **Lấy danh sách triggers của member** chưa hoạt động (thông báo "backend chưa hỗ trợ lấy dữ liệu")

## Backend cần implement những endpoints sau:

### 1. **GET Member's Trigger Factors (QUAN TRỌNG NHẤT)**

Backend cần có endpoint để coach có thể lấy danh sách trigger factors của member cụ thể:

```csharp
[HttpGet("GetMemberTriggerFactors/{memberId}")]
public async Task<IActionResult> GetMemberTriggerFactors(int memberId)
{
    try 
    {
        // Kiểm tra quyền: chỉ coach hoặc admin mới được xem
        var currentUser = GetCurrentUser();
        if (currentUser.UserType != "Coach" && currentUser.UserType != "Admin")
        {
            return Forbid("Chỉ huấn luyện viên mới có quyền xem trigger factors của thành viên");
        }

        // Lấy danh sách trigger factors của member
        var memberTriggers = await _context.MemberTriggerFactors
            .Where(mtf => mtf.MemberId == memberId)
            .Include(mtf => mtf.TriggerFactor)
            .Select(mtf => new
            {
                mtf.TriggerFactor.TriggerId,
                mtf.TriggerFactor.Name,
                mtf.TriggerFactor.CreatedAt,
                mtf.TriggerFactor.UpdatedAt
            })
            .ToListAsync();

        return Ok(memberTriggers);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Lỗi server: {ex.Message}");
    }
}
```

### 2. **Database Relationships (Nếu chưa có)**

Backend cần đảm bảo có bảng để lưu relationship giữa Member và TriggerFactor:

```csharp
// Model cho bảng junction
public class MemberTriggerFactor
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int TriggerId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public int? AssignedByCoachId { get; set; } // Ai assign (optional)

    // Navigation properties
    public MemberProfile Member { get; set; }
    public TriggerFactor TriggerFactor { get; set; }
    public User AssignedByCoach { get; set; }
}
```

### 3. **Cập nhật Assign Endpoint**

Đảm bảo endpoint assign lưu đúng vào database:

```csharp
[HttpPost("assign/{memberId}")]
public async Task<IActionResult> AssignTriggerFactorsToMember(int memberId, [FromBody] List<int> triggerIds)
{
    try
    {
        var currentUser = GetCurrentUser();
        if (currentUser.UserType != "Coach" && currentUser.UserType != "Admin")
        {
            return Forbid("Chỉ huấn luyện viên mới có quyền gán trigger factors");
        }

        // Kiểm tra member có tồn tại không
        var member = await _context.MemberProfiles.FindAsync(memberId);
        if (member == null)
        {
            return NotFound("Không tìm thấy thành viên");
        }

        // Xóa assignments cũ (nếu muốn replace)
        var existingAssignments = _context.MemberTriggerFactors
            .Where(mtf => mtf.MemberId == memberId);
        _context.MemberTriggerFactors.RemoveRange(existingAssignments);

        // Thêm assignments mới
        foreach (var triggerId in triggerIds)
        {
            var triggerExists = await _context.TriggerFactors.AnyAsync(tf => tf.TriggerId == triggerId);
            if (triggerExists)
            {
                _context.MemberTriggerFactors.Add(new MemberTriggerFactor
                {
                    MemberId = memberId,
                    TriggerId = triggerId,
                    AssignedByCoachId = currentUser.UserId,
                    AssignedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();
        return Ok("Đã gán trigger factors thành công");
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Lỗi server: {ex.Message}");
    }
}
```

### 4. **Alternative Endpoints (Tùy chọn)**

Nếu muốn linh hoạt hơn, có thể thêm:

```csharp
// GET với query parameter
[HttpGet("Get-MyTriggerFactor")]
public async Task<IActionResult> GetMyTriggerFactor([FromQuery] int? memberId = null)
{
    var currentUser = GetCurrentUser();
    
    // Nếu có memberId và user là coach
    if (memberId.HasValue && currentUser.UserType == "Coach")
    {
        return await GetMemberTriggerFactors(memberId.Value);
    }
    
    // Nếu không, lấy của current user
    return await GetMyTriggerFactors();
}

// GET by member với path khác
[HttpGet("GetByMember/{memberId}")]
public async Task<IActionResult> GetByMember(int memberId)
{
    return await GetMemberTriggerFactors(memberId);
}
```

### 5. **Database Migration (Nếu cần)**

Nếu chưa có bảng junction, cần tạo migration:

```csharp
public partial class AddMemberTriggerFactorRelationship : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "MemberTriggerFactors",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                MemberId = table.Column<int>(type: "int", nullable: false),
                TriggerId = table.Column<int>(type: "int", nullable: false),
                AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                AssignedByCoachId = table.Column<int>(type: "int", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MemberTriggerFactors", x => x.Id);
                table.ForeignKey(
                    name: "FK_MemberTriggerFactors_MemberProfiles_MemberId",
                    column: x => x.MemberId,
                    principalTable: "MemberProfiles",
                    principalColumn: "MemberId",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_MemberTriggerFactors_TriggerFactors_TriggerId",
                    column: x => x.TriggerId,
                    principalTable: "TriggerFactors",
                    principalColumn: "TriggerId",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_MemberTriggerFactors_Users_AssignedByCoachId",
                    column: x => x.AssignedByCoachId,
                    principalTable: "Users",
                    principalColumn: "UserId",
                    onDelete: ReferentialAction.SetNull);
            });

        migrationBuilder.CreateIndex(
            name: "IX_MemberTriggerFactors_MemberId",
            table: "MemberTriggerFactors",
            column: "MemberId");

        migrationBuilder.CreateIndex(
            name: "IX_MemberTriggerFactors_TriggerId",
            table: "MemberTriggerFactors",
            column: "TriggerId");
    }
}
```

## Testing Steps cho Backend

### 1. Test với Postman/Swagger:

```bash
# 1. Login as Coach
POST /api/Auth/login
{
  "email": "coach@example.com",
  "password": "password"
}

# 2. Get member's triggers (should work after implementation)
GET /api/TriggerFactor/GetMemberTriggerFactors/{memberId}
Authorization: Bearer {token}

# 3. Assign triggers
POST /api/TriggerFactor/assign/{memberId}
Content-Type: application/json
Authorization: Bearer {token}
[1, 2, 3]  # trigger IDs

# 4. Verify assignment worked
GET /api/TriggerFactor/GetMemberTriggerFactors/{memberId}
Authorization: Bearer {token}
```

### 2. Check Database:

```sql
-- Kiểm tra data có được lưu không
SELECT * FROM MemberTriggerFactors WHERE MemberId = {memberId};

-- Kiểm tra với JOIN
SELECT 
    mtf.Id,
    mtf.MemberId,
    mtf.TriggerId,
    tf.Name as TriggerName,
    mtf.AssignedAt,
    u.DisplayName as AssignedByCoach
FROM MemberTriggerFactors mtf
JOIN TriggerFactors tf ON mtf.TriggerId = tf.TriggerId
LEFT JOIN Users u ON mtf.AssignedByCoachId = u.UserId
WHERE mtf.MemberId = {memberId};
```

## Priority Implementation Order

1. **Cao nhất**: `GetMemberTriggerFactors/{memberId}` endpoint
2. **Cao**: Đảm bảo database relationship và assign endpoint hoạt động đúng
3. **Trung bình**: Alternative endpoints cho flexibility
4. **Thấp**: Audit trail và advanced features

---

**Lưu ý**: Frontend đã được chuẩn bị để thử multiple endpoints, nên khi backend implement endpoint nào, frontend sẽ tự động detect và sử dụng endpoint đó.
