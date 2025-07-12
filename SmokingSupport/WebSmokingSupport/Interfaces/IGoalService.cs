using WebSmokingSupport.DTOs;

namespace WebSmokingSupport.Interfaces
{
    public interface IGoalService
    {
        Task<DTOGoalPlanForCurrent?> GetCurrentGoalAsync(int userId);
    }
}
