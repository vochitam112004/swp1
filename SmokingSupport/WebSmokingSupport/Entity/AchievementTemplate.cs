using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace WebSmokingSupport.Entity
{
    public class AchievementTemplate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TemplateId { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public int RequiredSmokeFreeDays { get; set; }

        public string? Description { get; set; }
    }
}
