using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForRead
    {
        public int LogId { get; set; }
        public int? MemberId { get; set; }
        public DateTime LogDate { get; set; } 
        public string? ProgressLogMemberName { get; set; } // tên của người dùng ghi nhận log này
        public string? Notes { get; set; }  
        public int? CigarettesSmoked { get; set; } 
        public string? Mood { get; set; } 
        public string? Triggers { get; set; } // các yếu tố kích thích trong ngày
        public string? Symptoms { get; set; } // các triệu chứng trong ngày
        public int? GoalPlanId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
}
