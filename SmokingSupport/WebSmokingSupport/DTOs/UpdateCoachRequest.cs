namespace WebSmokingSupport.DTOs
{
    public class UpdateCoachRequest
    {
        public int CoachId { get; set; }

        // Từ bảng User
        public string? DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
        public string? PhoneNumber { get; set; }

        // Từ bảng CoachProfile
        public string? Specialization { get; set; }
    }
}