using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForCreate
    {

        [Required]
        public DateOnly LogDate { get; set; }


        [Required]
        public int CigarettesSmoked { get; set; }   

        [Required]
        public decimal PricePerPack { get; set; }

        [Required]
        public int CigarettesPerPack { get; set; }

        public string? Mood { get; set; }
        public string? Notes { get; set; }
    }
}
