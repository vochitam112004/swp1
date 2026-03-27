using WebSmokingSupport.Entity;

namespace WebSmokingSupport.DTOs
{
    public class DTOSystemReportForRead
    {
        public int ReportId { get; set; }

        public int? ReporterId { get; set; }
        public string? NameReporter { get; set; }
        public string? ReportType { get; set; }

        public DateTime? ReportedAt { get; set; }

        public string? Details { get; set; }
    }
}
