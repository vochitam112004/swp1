using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForCreate
    {
       
        public DateOnly LogDate { get; set; }

        [Required(ErrorMessage = "CigarettesSmoked is required")]
       
        [Range(0, 100, ErrorMessage = "CigarettesSmoked must be between 0 and 1000")]
        public int CigarettesSmoked { get; set; }
        public decimal? PricePerPack { get; set; }

        [StringLength(50 , ErrorMessage ="does not over 50 character")]
        public string? Mood { get; set; }

        public string? Trigger { get; set; }

        public string? Notes { get; set; }
    }
}
