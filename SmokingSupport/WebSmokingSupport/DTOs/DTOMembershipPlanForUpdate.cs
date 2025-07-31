namespace WebSmokingSupport.DTOs
{
    public class DTOMembershipPlanForUpdate
    {

        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!; // Mô tả ngắn về gói thành viên
        public int DurationDays { get; set; } // Ví dụ: 30, 90, 365
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
