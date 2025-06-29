namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForRead
    {
        public DateOnly? LogDate { get; set; }
        public int? CigarettesSmoked { get; set; }
        public decimal? PricePerPack { get; set; }
        public string? Mood { get; set; }

        public string? Trigger { get; set; }

        public string? Notes { get; set; }

    }
}
