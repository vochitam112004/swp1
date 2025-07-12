namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForUpdate
    {
       
        public DateOnly? TargetQuitDate { get; set; }
        public bool? isCurrentGoal { get; set; }
        public string? PersonalMotivation { get; set; }

        public bool? UseTemplate { get; set; }
     
    }
}
