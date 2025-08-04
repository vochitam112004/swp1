namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanWeeklyReductionForRead
    {
        public int WeeklyReductionId { get; set; }
        public int GoalPlanId { get; set; }
        public int WeekNumber { get; set; }
        public int totalCigarettes { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
