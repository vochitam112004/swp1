using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.Entity
{
    public class UserMembershipPayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; } 
        public int UserId { get; set; }  
        public int PlanId { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public DateTime ExpirationDate { get; set; } 
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = "Pending"; 
        public string? TransactionId { get; set; } 
        public User User { get; set; } = null!;
        public MembershipPlan Plan { get; set; } = null!;
    }
}
