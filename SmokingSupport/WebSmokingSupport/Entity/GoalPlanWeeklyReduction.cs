using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace WebSmokingSupport.Entity
{
    public class GoalPlanWeeklyReduction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WeeklyReductionId { get; set; }
        public int GoalPlanId { get; set; }
        public int WeekNumber { get; set; } // Tuần trong kế hoạch
        public int totalCigarettes { get; set; } // Số lượng thuốc lá giảm trong tuần
        public DateOnly StartDate { get; set; } // Ngày bắt đầu của tuần
        public DateOnly EndDate { get; set; } // Ngày kết thúc của tuần
        public virtual GoalPlan? GoalPlan { get; set; } // Liên kết với GoalPlan
    }
}
