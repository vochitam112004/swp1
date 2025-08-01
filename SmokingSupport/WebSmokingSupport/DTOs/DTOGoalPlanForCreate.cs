using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForCreate
    {
        public DateOnly StartDate { get; set; } 
        public bool isCurrentGoal { get; set; } = true;
        public DateOnly EndDate { get; set; } 
        public int TotalDays { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
        public DateTime? UpdatedAt { get; set; }
    }
}
