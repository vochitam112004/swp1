namespace WebSmokingSupport.Interfaces
{
    public interface IRankingService
    {
        Task UpdateUserScoreAndBadges(int userId, int smokeFreeDays);
        Task CheckAndAwardBadges(int userId, int score);
    }
}
