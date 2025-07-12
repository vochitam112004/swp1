using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOUserMembershipPaymentForCreate
    {
        [Required(ErrorMessage ="PlanId is requirement")]
        public int PlanId { get; set; } 
        public string TransactionId { get; set; } = null!;
        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero")]
        public decimal Amount { get; set; }

    }
}
