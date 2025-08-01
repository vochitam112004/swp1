using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOMemberProfileForCreate
    {
        [Required]
        public int? CigarettesSmoked { get; set; } // số điếu thuốc hút mỗi ngày 
        public int? QuitAttempts { get; set; } // số lần cai thuốc lá trứóc đây 
        public int? ExperienceLevel { get; set; } // số năm hút thuốc lá
        public string? PersonalMotivation { get; set; } // động lực cá nhân để cai thuốc lá
        public string? health { get; set; } // sức khỏe hiện tại
        [Required]
        public decimal PricePerPack { get; set; } // số tiền của mỗi bao thuốc lá 

        [Required]
        public int CigarettesPerPack { get; set; } // số điếu thuốc trong mỗi bao
        public DateTime? Create { get; set; } = DateTime.UtcNow; // ngày tạo hồ sơ

    }
}
