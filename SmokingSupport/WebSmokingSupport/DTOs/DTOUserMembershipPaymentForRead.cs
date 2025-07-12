namespace WebSmokingSupport.DTOs
{
    public class DTOUserMembershipPaymentForRead
    {
        public int PaymentId { get; set; } // ID của thanh toán
        public int UserId { get; set; }
        public int PlanId { get; set; }
        public string PlanName { get; set; } = null!; // Tên gói
        public decimal PlanPrice { get; set; } // Giá gói
        public DateTime PaymentDate { get; set; }
        public DateTime ExpirationDate { get; set; } // Ngày hết hạn của thanh toán (hoặc của gói)
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public string? TransactionId { get; set; }
        public string UserName { get; set; } = null!; // Tên người dùng
    }
}
