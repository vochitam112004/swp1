namespace WebSmokingSupport.DTOs
{
    public class DTOPaymentSuccessResponse
    {
        public string Message { get; set; } = "Thanh toán thành công và gói thành viên đã được kích hoạt.";
        public DTOUserMembershipPaymentForRead PaymentDetails { get; set; } = null!;
        public DTOUserMemberShipHistoryForRead MembershipHistoryDetails { get; set; } = null!;
    }
}
