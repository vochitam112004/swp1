using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOUserBadgeForCreate
    {
        [Required(ErrorMessage ="UserID is required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "BadgeID is required")]
        public int BadgeId { get; set; }

        public DateTime? EarnedAt { get; set; }
    }
}
