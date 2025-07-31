namespace WebSmokingSupport.DTOs
{
    public class DTOMembershipPlanForCreate
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!; // Mô tả ngắn về gói thành viên
        public int DurationDays { get; set; } // Ví dụ: 30, 90, 365
        public decimal Price { get; set; }
    }
}
