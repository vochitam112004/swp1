﻿namespace WebSmokingSupport.DTOs
{
    public class DTOAppointmentForCoachView
    {
        public int AppointmentId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string? Status { get; set; }
        public string? MemberName { get; set; }
    }
}
