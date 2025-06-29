using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOBadgeForCreate
    {
        [Required(ErrorMessage ="Name Badge not null")]
        [StringLength(100 ,ErrorMessage = "Name Badge not over 100 character")]
        public string Name { get; set; } = string.Empty;
         
        public string? Description { get; set; }

        public string? IconUrl { get; set; }

    }
}
