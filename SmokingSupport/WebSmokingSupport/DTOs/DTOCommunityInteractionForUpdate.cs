namespace WebSmokingSupport.DTOs
{
    public class DTOCommunityInteractionForUpdate
    {
        public bool? isEdit { get; set; } = false;
        public DateTime? EditedAt { get; set; }

        public string? CommentContent { get; set; }
    }
}
