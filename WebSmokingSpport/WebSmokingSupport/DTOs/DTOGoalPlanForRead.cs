namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForRead
    {
        public DateOnly? StartDate { get; set; }

        public DateOnly? TargetQuitDate { get; set; }

        public string? PersonalMotivation { get; set; }

        public bool? UseTemplate { get; set; }
    }
}
