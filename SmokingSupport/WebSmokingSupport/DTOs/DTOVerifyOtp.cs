using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOVerifyOtp
    {
        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không hợp lệ.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Mã OTP là bắt buộc.")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Mã OTP phải có 6 chữ số.")]
        public string? OtpCode { get; set; }
    }
}
