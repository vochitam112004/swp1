namespace WebSmokingSupport.DTOs
{
    public class DTORankingByDays
    {
        public int UserId { get; set; }
        public string NameDisPlay { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public int ReducedDays { get; set; } 
    }
}
