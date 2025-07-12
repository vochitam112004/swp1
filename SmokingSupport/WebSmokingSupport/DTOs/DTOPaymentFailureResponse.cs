namespace WebSmokingSupport.DTOs
{
    public class DTOPaymentFailureResponse
    {
        public string Message { get; set; } = "Thanh toán thất bại.";
        public string? ErrorDetails { get; set; }
    }
}
