namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForUpdate
    {
       
        public DateOnly? TargetQuitDate { get; set; }
      
        public int GoalPlanId { get; set; }
        public string? PersonalMotivation { get; set; }

        public bool? UseTemplate { get; set; }
     
    }
}
