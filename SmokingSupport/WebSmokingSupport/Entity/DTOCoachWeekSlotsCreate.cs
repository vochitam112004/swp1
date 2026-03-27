namespace WebSmokingSupport.Entity
{
    public class DTOCoachWeekSlotsCreate
    {
        public List<DTOCoachSlotCreate> Availabilities { get; set; }
    }

    public class DTOCoachSlotCreate
    {
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
