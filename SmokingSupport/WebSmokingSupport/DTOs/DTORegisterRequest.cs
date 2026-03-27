using System.ComponentModel.DataAnnotations;

namespace WebSmokingSpport.DTOs
{
    /// <summary>
    /// DTO dùng để đăng ký người dùng mới 
    /// </summary>
    public class DTORegisterRequest
    {
       
        [Required(ErrorMessage ="Password required to register")]
        [StringLength(50, MinimumLength = 6, ErrorMessage ="password must length min 6 and max 50 character")]
        public string? password { get; set; }
        [Required(ErrorMessage ="Email to required register")]
        [EmailAddress(ErrorMessage ="Email not match")]
        public string? Email { get; set; }
        [Required(ErrorMessage ="Name DisPlay to required")]
        [StringLength( 50, ErrorMessage ="Name display not over 50 character")]
        public string? DisplayName { get; set; }
        [Required(ErrorMessage = "PhoneNumber to required")]
        public string PhoneNumber { get; set; } = string.Empty;

    }
}
