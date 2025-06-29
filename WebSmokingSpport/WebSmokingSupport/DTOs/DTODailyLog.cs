namespace WebSmokingSupport.DTOs
{
    public class DTODailyLog
    {
        public DateOnly? LogDate { get; set; }
        public int? CigarettesSmoked { get; set; }
        public decimal? PricePerPack { get; set; }
    }
}
