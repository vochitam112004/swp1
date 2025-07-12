using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTORankingForUpdateOrCreate
    {
        [Required(ErrorMessage = "User ID là bắt buộc.")]
        public int UserId { get; set; } 

        [Required(ErrorMessage = "Điểm số là bắt buộc.")]
        [Range(0, int.MaxValue, ErrorMessage = "Điểm số phải là số không âm.")]
        public int Score { get; set; }
    }
}
