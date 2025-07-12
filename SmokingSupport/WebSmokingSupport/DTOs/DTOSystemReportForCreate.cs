using WebSmokingSupport.Entity;

namespace WebSmokingSupport.DTOs
{
    public class DTOSystemReportForCreate
    {

        public string? ReportType { get; set; }
        public string userName { get; set; } = string.Empty;
        public DateTime? ReportedAt { get; set; }
        public string? Details { get; set; }
    }
}
