
namespace WebSmokingSupport.DTOs
{
    public class DTODiaryLogForCreate
    {
        public DateTime LogDate { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
