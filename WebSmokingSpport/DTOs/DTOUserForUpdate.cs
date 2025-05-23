namespace WebSmokingSpport.DTOs
{
    public class DTOUserForUpdate
    {
        public int UserId   { get; set; }
        public string? UserName { get; set; }
        public string?  PasswordHash { get; set; }
        public string? DisplayName { get; set; }

        public string?  UserType { get; set; }
        public string? AvatarUrl { get; set; }

        public bool? IsActive { get; set; }
    }
}
