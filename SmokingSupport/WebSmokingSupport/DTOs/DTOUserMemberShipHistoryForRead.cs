namespace WebSmokingSupport.DTOs
{
    public class DTOUserMemberShipHistoryForRead
    {
        public int HistoryId { get; set; }
        public int UserId { get; set; }
        public int PlanId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? UserName { get; set; } = null!;
        public string? PlanName { get; set; } = null!;
        public decimal Price { get; set; }
    }
}
