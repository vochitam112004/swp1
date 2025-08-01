using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForCreate
    {

        [Required]
        public DateOnly LogDate { get; set; }
        [Required]
        public int CigarettesSmoked { get; set; }   
    }
}
