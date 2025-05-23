namespace WebSmokingSpport.DTOs
{
    public class DTOUserForCreate
    {
        public string? UserName { get; set; }
        public string? PasswordHash { get; set; }
        public string? DisplayName { get; set; }

        public string? UserType { get; set; }
        public string? AvatarUrl { get; set; }

        public bool? IsActive { get; set; }
    }
}
