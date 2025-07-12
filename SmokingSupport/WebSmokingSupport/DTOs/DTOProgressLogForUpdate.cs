﻿namespace WebSmokingSpport.DTOs
{
    public class DTOProgressLogForUpdate
    {
        public DateOnly LogDate { get; set; }
        public int? CigarettesSmoked { get; set; }
        public decimal? PricePerPack { get; set; }
        public int? CigarettesPerPack { get; set; }
        public string? Mood { get; set; }

        public string? Notes { get; set; }
    }
}
