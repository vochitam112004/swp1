namespace WebSmokingSupport.DTOs
{
    public class DTOFeedbackForRead
    {
        public int FeedbackId { get; set; }

        public int? UserId { get; set; }
        public string? DisPlayName { get; set; }
        public int? Rating { get; set; } = 0;

        public bool? isType { get; set; }

        public string? Content { get; set; }

        public DateTime? SubmittedAt { get; set; }

    }
}
