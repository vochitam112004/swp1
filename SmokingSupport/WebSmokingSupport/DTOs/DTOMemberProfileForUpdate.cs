namespace WebSmokingSupport.DTOs
{
    public class DTOMemberProfileForUpdate
    {
       
        public string? SmokingStatus { get; set; }

        public int? QuitAttempts { get; set; }

        public int? experience_level { get; set; }

        public string? PreviousAttempts { get; set; }
        public DateTime? UpdatedAt { get; set; }


    }
}
