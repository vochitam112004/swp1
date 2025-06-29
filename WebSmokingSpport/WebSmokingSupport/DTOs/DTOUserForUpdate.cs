namespace WebSmokingSpport.DTOs
{
    public class DTOUserForUpdate
    {
        public string? UserName { get; set; }
        public string? DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public bool? IsActive { get; set; }
    }
}
