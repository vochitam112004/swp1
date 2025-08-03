namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForRead
    {
        public int LogId { get; set; }
        public int? MemberId { get; set; }
        public string ProgressLogMemberName { get; set; } = string.Empty;
        public DateTime? LogDate { get; set; }
        public int? CigarettesSmoked { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }

    }
}
