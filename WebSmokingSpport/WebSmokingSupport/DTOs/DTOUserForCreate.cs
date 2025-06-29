namespace WebSmokingSpport.DTOs
{
    public class DTOUserForCreate
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? DisplayName { get; set; }

        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? UserType { get; set; }
        public string? AvatarUrl { get; set; }

        public bool? IsActive { get; set; }
    }
    
}