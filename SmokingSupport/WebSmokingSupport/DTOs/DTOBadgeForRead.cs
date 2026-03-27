namespace WebSmokingSupport.DTOs
{
    public class DTOBadgeForRead
    {
        public int BadgeId { get; set; }

        public string? Name { get; set; } 
        public int RequiredScore { get; set; } 
        public string MemberNameOfBadge { get; set; } = string.Empty; 

        public string? Description { get; set; }

        public string? IconUrl { get; set; }
    }
}
