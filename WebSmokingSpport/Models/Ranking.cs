using System;
using System.Collections.Generic;

namespace WebSmokingSpport.Models;

public partial class Ranking
{
    public int RankingId { get; set; }

    public int? UserId { get; set; }

    public int? Score { get; set; }

    public DateTime? LastUpdated { get; set; }

    public virtual User? User { get; set; }
}
