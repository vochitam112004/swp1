﻿using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOAdminResgisterCoach
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        [StringLength(100, MinimumLength =5, ErrorMessage ="password must least 5 character ")]
        public string? passWord { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        [Required(ErrorMessage = "UserType phải là 'Coach' hoặc 'Admin'")]
        [RegularExpression("^(Coach|Admin)$", ErrorMessage = "UserType phải là 'Coach' hoặc 'Admin'")]
        public string UserType { get; set; } = "Coach";
        public string? DisplayName { get; set; }
        public string Address { get; set; } = string.Empty;

    }
}
