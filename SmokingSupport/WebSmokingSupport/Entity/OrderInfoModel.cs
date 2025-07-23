namespace WebSmokingSupport.Entity
{
    public class OrderInfoModel
    {

        public string OrderId { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;

        public int UserId { get; set; }
        public int PlanId { get; set; }

        public string OrderInfo => $"{UserId}-{PlanId}";
    }
}
