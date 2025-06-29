namespace WebSmokingSupport.DTOs
{
    public class DTONotificationForCreateAndUpdate
    {
        public int? MemberId { get; set; }

        public string? Content { get; set; }

        public string? Type { get; set; }

        public bool? IsRead { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
