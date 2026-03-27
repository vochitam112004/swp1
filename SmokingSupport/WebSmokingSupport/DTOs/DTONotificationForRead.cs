namespace WebSmokingSupport.DTOs
{
    public class DTONotificationForRead
    {
        public int NotificationId { get; set; }
        public int? MemberId { get; set; }
        public string? Content { get; set; }
        public string? Type { get; set; }
        public bool? IsRead { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
