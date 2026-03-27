namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForUpdate
    {
        public DateOnly? StartDate { get; set; } // ngày bắt đầu kế hoạch
        public DateOnly? EndDate { get; set; } // ngày kết thúc kế hoạch
        public bool? IsCurrentGoal { get; set; } = true; // đánh dấu kế hoạch hiện tại
        public DateTime UpdatedAt { get; set; }

    }
}
