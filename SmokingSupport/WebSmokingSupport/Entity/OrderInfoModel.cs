namespace WebSmokingSupport.Entity
{
    public class OrderInfoModel
    {
        public string OrderId { get; set; }
        public long Amount { get; set; }
        public string OrderInfo { get; set; } // Sẽ lưu trữ "userId-planId"
        public int UserId { get; set; } // Đã thêm để truyền trực tiếp userId
        public int PlanId { get; set; } // Đã thêm để truyền trực tiếp planId
    }
}
