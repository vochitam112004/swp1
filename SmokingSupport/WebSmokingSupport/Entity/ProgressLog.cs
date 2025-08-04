using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
namespace WebSmokingSupport.Entity;

public partial class ProgressLog
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int LogId { get; set; }
    [Required]
    public DateTime LogDate { get; set; } // ngày ghi nhận 
    public string? Notes { get; set; }  // nhận xét của người dùng về quá trình cai thuốc lá
    public int? CigarettesSmoked { get; set; } // số điếu thuốc hút trong ngày
    public string? Mood { get; set; } // tâm trạng của người dùng trong ngày
    public string? Triggers { get; set; } // các yếu tố kích thích trong ngày
    public string? Symptoms { get; set; } // các triệu chứng trong ngày
    public int GoalPlanId { get; set; }
    public DateTime ? CreatedAt { get; set; }
    public DateTime ? UpdatedAt { get; set; }
    public virtual GoalPlan GoalPlan { get; set; }
}
