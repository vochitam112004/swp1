namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForCreate
    {
        
        public DateOnly? TargetQuitDate { get; set; }
        public string? PersonalMotivation { get; set; }

        public bool? isCurrentGoal { get; set; }
        public  bool? UseTemplate { get; set; }
    }
}
