namespace WebSmokingSupport.DTOs
{
    public class DTOCoachForUpdate
    {
        public string? Username { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
     
        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public bool? IsActive { get; set; } = true;
        public DateTime? UpdatedAt { get; set; }
    }
}
