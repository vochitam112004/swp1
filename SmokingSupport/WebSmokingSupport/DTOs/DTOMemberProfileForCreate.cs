using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOMemberProfileForCreate
    {
        public string? SmokingStatus { get; set; }

        public int? QuitAttempts { get; set; }

        public int? experience_level { get; set; }

        public string? PreviousAttempts { get; set; }
    }
}
