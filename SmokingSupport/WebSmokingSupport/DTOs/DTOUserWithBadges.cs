namespace WebSmokingSupport.DTOs
{
    public class DTOUserWithBadges
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public int Score { get; set; }
        public List<DTOBadge> Badges { get; set; } = new();
    }
}
