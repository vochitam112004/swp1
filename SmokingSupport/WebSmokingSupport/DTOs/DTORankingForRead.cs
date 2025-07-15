namespace WebSmokingSupport.DTOs
{
    public class DTORankingForRead
    {
        public int RankingId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public int? Score { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
