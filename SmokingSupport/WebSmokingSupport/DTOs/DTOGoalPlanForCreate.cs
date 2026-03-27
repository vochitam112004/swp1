using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForCreate
    {
        public DateOnly StartDate { get; set; } 
        public DateOnly EndDate { get; set; } 
    }
}
