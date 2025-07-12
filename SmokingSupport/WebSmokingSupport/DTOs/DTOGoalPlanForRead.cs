namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForRead
    {
        public int PlanId { get; set; } 
        public int MemberId { get; set; } 
        public string? MemberName { get; set; } 
        public DateOnly? StartDate { get; set; }
        public bool? isCurrentGoal { get; set; }
        public DateOnly? TargetQuitDate { get; set; }

        public string? PersonalMotivation { get; set; }

        public bool? UseTemplate { get; set; }
    }
}
