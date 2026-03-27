namespace WebSmokingSupport.DTOs
{
    public class DTOUserBadgeForRead
    {
        public int UserId   { get; set; }
        public int BadgeId { get; set; }

        public string? DisplayName { get; set; }
        public string? Description { get; set; }
        public string? name { get; set; }
        public DateTime? earned_at { get; set; }

        public string? IconUrl { get; set; }
    }
}
