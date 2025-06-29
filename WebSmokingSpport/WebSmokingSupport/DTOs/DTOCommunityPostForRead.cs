namespace WebSmokingSupport.DTOs
{
    public class DTOCommunityPostForRead
    {
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; }

        public DateTime? CreatedAt { get; set; }
        public string? ImageUrl { get; set; }

        public string DisplayName { get; set; } = string.Empty;
    }
}
