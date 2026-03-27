namespace WebSmokingSupport.DTOs
{
    public class DTOUserForRead
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? UserType { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public bool? IsActive { get; set; }
    }
}
