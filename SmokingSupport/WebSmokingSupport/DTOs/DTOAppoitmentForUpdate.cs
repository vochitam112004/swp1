namespace WebSmokingSupport.DTOs
{
    public class DTOAppoitmentForUpdate
    {
        public DateOnly? AppointmentDate { get; set; }
        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }

        public string? Status { get; set; }

        public string? Notes { get; set; }
        public string? MeetingLink { get; set; }
    }
}
