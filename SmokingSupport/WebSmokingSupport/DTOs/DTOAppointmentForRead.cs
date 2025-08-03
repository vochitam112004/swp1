namespace WebSmokingSupport.DTOs
{
    public class DTOAppointmentForRead
    {
        public int AppointmentId { get; set; }
        public string MemberName { get; set; } = string.Empty;
        public string CoachName { get; set; } = string.Empty;
        public int? MemberId { get; set; }

        public int? CoachId { get; set; }
        public DateOnly? AppointmentDate { get; set; }
        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }

        public string? Status { get; set; }

        public string? Notes { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? MeetingLink { get; set; }
    }
}
