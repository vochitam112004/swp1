namespace WebSmokingSupport.DTOs
{
    public class DTOCoachSlotCreated
    {
        public int AppointmentId { get; set; }
        public int CoachId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string Status { get; set; }
    }

}
