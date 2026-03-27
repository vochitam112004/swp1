namespace WebSmokingSupport.DTOs
{
    public class DTOCoachSlotCreate
    {
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string? Notes { get; set; }
    }
}
