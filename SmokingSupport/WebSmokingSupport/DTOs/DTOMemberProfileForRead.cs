namespace WebSmokingSupport.DTOs
{
    public class DTOMemberProfileForRead
    {
        public int MemberId { get; set; }
        public string? SmokingStatus { get; set; }

        public int? QuitAttempts { get; set; }

        public int? experience_level { get; set; }

        public string? PreviousAttempts { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
