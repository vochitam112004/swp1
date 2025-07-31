namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForRead
    {
        public int LogId { get; set; }
        public int? MemberId { get; set; }
        public string ProgressLogMemberName { get; set; } = string.Empty;
        public DateOnly? LogDate { get; set; }
        public int? CigarettesSmoked { get; set; }
        public decimal? PricePerPack { get; set; }
        public string? Mood { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int CigarettesPerPack { get; set; } = 20; // Default value if not provided
        public string? Notes { get; set; }

    }
}
