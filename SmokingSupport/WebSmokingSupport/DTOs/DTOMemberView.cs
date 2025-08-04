namespace WebSmokingSupport.DTOs
{
    public class DTOMemberView
    {
        public int MemberId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }

        
        public int TotalAppointments { get; set; }
        public int CompletedAppointments { get; set; }
        public int CancelledAppointments { get; set; }

        
        public DateOnly? NextAppointmentDate { get; set; }
        public TimeOnly? NextAppointmentStartTime { get; set; }
        public TimeOnly? NextAppointmentEndTime { get; set; }
        public string? NextAppointmentStatus { get; set; }
    }
}
