using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForCreate
    {
        
        public DateOnly? TargetQuitDate { get; set; }
        public string? PersonalMotivation { get; set; }

        [Required]
        public decimal PricePerPack { get; set; }

        [Required]
        public int CigarettesPerPack { get; set; }

        public string? Mood { get; set; }
        public string? Notes { get; set; }
        public bool? isCurrentGoal { get; set; }
    }
}
