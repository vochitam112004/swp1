using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class CoachProfile
{
    public int CoachId { get; set; }
    public int? UserId { get; set; }

    public string? Specialization { get; set; }
    public DateTime? CreateAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual User Coach { get; set; } = null!;
}
