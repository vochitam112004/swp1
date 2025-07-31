using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOForgotPasswordRequestDTO
    {
        [Required(ErrorMessage ="Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
    }
}
