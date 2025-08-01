using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace WebSmokingSupport.Entity;

public partial class MemberProfile
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int MemberId { get; set; }
    public int UserId { get; set; }
    public int? CigarettesSmoked { get; set; } // số điếu thuốc hút mỗi ngày 
    public int? QuitAttempts { get; set; } // số lần cai thuốc lá trứóc đây 
    public int? ExperienceLevel { get; set; } // số năm hút thuốc lá
    public string? PersonalMotivation { get; set; } // động lực cá nhân để cai thuốc lá
    public string? health { get; set; } // sức khỏe hiện tại
    [Required]
    public decimal PricePerPack { get; set; } // số tiền của mỗi bao thuốc lá 

    [Required]
    public int CigarettesPerPack { get; set; } // số điếu thuốc trong mỗi bao
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ngày tạo hồ sơ
    public DateTime? UpdatedAt { get; set; } // ngày cập nhật hồ sơ

    public virtual ICollection<GoalPlan> GoalPlans { get; set; } = new List<GoalPlan>(); 
    public virtual User User { get; set; } = null!;
 
    public virtual ICollection<MemberTrigger> MemberTriggers { get; set; } = new List<MemberTrigger>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<ProgressLog> ProgressLogs { get; set; } = new List<ProgressLog>();
}
