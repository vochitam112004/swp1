using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.Entity
{
    public class UserAchievement
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AchievementId { get; set; }

        [Required]
        public int UserId { get; set; }
        public int TemplateId { get; set; } 
        public int SmokeFreeDays { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public virtual AchievementTemplate? Template { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
