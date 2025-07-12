using WebSmokingSupport.Entity;

namespace WebSmokingSupport.DTOs
{
    public class DTOCommunityInteractionForCreate
    {
        public string? CommentContent { get; set; }

        public DateTime? CommentedAt { get; set; }
    }
}
