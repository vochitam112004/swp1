namespace WebSmokingSupport.DTOs
{
    public class DTOComunityPostForUpdate

    {
       
        public string Title { get; set; } = string.Empty;
        public IFormFile? ImageUrl { get; set; }
        public string? Content { get; set; }

    }
}
