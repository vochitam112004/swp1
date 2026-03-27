namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForRead
    {
        public int PlanId { get; set; }
        public int UserId { get; set; }
        public DateOnly StartDate { get; set; } 
        public bool isCurrentGoal { get; set; } = true;
        public DateOnly EndDate { get; set; }
        public string MemberDisplayName { get; set; } = null!;
        public int TotalDays { get; set; } 
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
