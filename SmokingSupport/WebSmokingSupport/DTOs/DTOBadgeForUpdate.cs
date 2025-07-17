namespace WebSmokingSpport.DTOs
{
    public class DTOBadgeForUpdate
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int RequiredScore { get; set; }
        public IFormFile? IconFile { get; set; }

    }
}
