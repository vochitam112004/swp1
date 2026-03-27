using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOMoneySavedResult
    {
        public decimal TotalMoneySaved { get; set; }
        public int DaysReducedSmoking { get; set; }
        public List<DTODailyReduction> DailyReductions { get; set; } = new();
    }
}
