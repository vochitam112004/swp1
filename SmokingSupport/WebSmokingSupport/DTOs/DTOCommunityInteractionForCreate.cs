using WebSmokingSupport.Entity;

namespace WebSmokingSupport.DTOs
{
    public class DTOCommunityInteractionForCreate
    {
        public int? PostId { get; set; }
        public string? CommentContent { get; set; }

        public DateTime? CommentedAt { get; set; }
    }
}
