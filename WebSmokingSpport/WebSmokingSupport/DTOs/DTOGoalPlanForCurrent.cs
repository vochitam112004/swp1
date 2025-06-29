﻿namespace WebSmokingSupport.DTOs
{
    public class DTOGoalPlanForCurrent
    {
        public DateTime? StartDate { get; set; }
        public DateTime? TargetQuitDate { get; set; }
        public string? PersonalMotivation { get; set; }
        public int DayNumber { get; set; }
        public int TotalDays { get; set; }
        public int TotalCigarettesSmoked { get; set; }
        public Decimal TotalSpenMoney { get; set; }
        public decimal TodaySpent { get; set; }
        public decimal YesterdaySpent { get; set; }
        public List<DTODailyLog> Logs { get; set; } = new();
    }
}
