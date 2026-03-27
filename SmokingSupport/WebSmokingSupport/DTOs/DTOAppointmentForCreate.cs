namespace WebSmokingSupport.DTOs
{
    public class DTOAppointmentForCreate
    {
        public int stagerId { get; set; }
        public TimeOnly StartTime { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly EndTime { get; set; }

        public string? Status { get; set; }

        public string? Notes { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? MeetingLink { get; set; }
    }
}
