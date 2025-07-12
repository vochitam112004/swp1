﻿using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOCoachResponse
    {
        public int CoachId { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string? Specialization { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
