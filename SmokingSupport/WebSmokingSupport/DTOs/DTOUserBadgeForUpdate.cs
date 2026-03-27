using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    public class DTOUserBadgeForUpdate
    {
        [Required(ErrorMessage ="UserID is required")]
        public int Userid { get; set; }
        [Required(ErrorMessage ="BadgeID is required")]
        public int Badgeid { get; set; }
        public DateTime? EarnedAt { get; set; }
    }
}
