namespace WebSmokingSupport.DTOs
{
    public class DTOConfirmChangePassword
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? Otp { get; set; }
    }
}
