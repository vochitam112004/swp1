namespace WebSmokingSupport.DTOs
{
    public class DTOMembershipPlanForRead
    {
        public int PlanId { get; set; }
        public string Name { get; set; } = null!;
        public int DurationDays { get; set; } 
        public decimal Price { get; set; }
        public string Description { get; set; } = null!;
        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; }
    }
}
