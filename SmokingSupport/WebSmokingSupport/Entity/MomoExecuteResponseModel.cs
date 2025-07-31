namespace WebSmokingSupport.Entity
{
    public class MomoExecuteResponseModel
    {
        public string OrderId { get; set; }
        public string? Amount { get; set; } // Đảm bảo đây là string nếu MoMo trả về như vậy
        public string FullName { get; set; }
        public string OrderInfo { get; set; }
        public string Status { get; set; } // Thành công / Thất bại
        public string Message { get; set; }
    }

}