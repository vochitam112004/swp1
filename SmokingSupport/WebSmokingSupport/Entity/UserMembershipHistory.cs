using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSmokingSupport.Entity
{
    public class UserMembershipHistory
    {
        //history of user membership plans
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HistoryId { get; set; }
        public int UserId { get; set; }
        public int? PlanId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        [ForeignKey("PlanId")]
        public MembershipPlan? Plan { get; set; } 
    }
}
