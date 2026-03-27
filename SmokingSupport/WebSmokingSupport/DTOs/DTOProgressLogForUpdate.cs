namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForUpdate
    {
        public DateOnly LogDate { get; set; } // ngày ghi nhận 
        public string? Notes { get; set; }  // nhận xét của người dùng về quá trình cai thuốc lá
        public int? CigarettesSmoked { get; set; } // số điếu thuốc hút trong ngày
        public string? Mood { get; set; } // tâm trạng của người dùng trong ngày
        public string? Triggers { get; set; } 
        public string? Symptoms { get; set; } 
        public DateTime? UpdatedAt { get; set; }
    }
}
