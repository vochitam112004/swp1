namespace WebSmokingSupport.Interfaces
{
    public interface IOtpService
    {
        Task SaveOtpAsync(string email, string otp);
        Task<bool> VerifyOtpAsync(string email, string otp);
    }
}
