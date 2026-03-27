using WebSmokingSupport.Entity;

namespace WebSmokingSupport.DTOs
{
    public class DTOCommunityInteractionForRead
    {
        public int InteractionId { get; set; }

        public int? PostId { get; set; }

        public int? UserId { get; set; }
        public bool? isEdit { get; set; } = false;
        public DateTime? EditedAt { get; set; }

        public string? CommentContent { get; set; }

        public DateTime? CommentedAt { get; set; }


    }
}
