using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int? MemberId { get; set; }

    public int? CoachId { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public virtual CoachProfile? Coach { get; set; }

    public virtual MemberProfile? Member { get; set; }
}
