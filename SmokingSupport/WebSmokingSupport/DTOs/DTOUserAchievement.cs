namespace WebSmokingSupport.DTOs
{
    public class DTOUserAchievement
    {
        public int AchievementId { get; set; }
        public int UserId { get; set; }
        public int SmokeFreeDays { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
