﻿using System.ComponentModel.DataAnnotations;

namespace WebSmokingSupport.DTOs
{
    public class DTOCommunityPostForCreate
    {
        public string? Content   { get; set; }
        public string? Title { get; set; }
        public IFormFile? ImageUrl { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
