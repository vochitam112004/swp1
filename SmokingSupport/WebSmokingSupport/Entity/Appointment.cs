using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace WebSmokingSupport.Entity;

public partial class Appointment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AppointmentId { get; set; }

    public int? MemberId { get; set; }

    public int? CoachId { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }
    public DateOnly AppointmentDate { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }
    public DateTime? CreatedAt { get; set; }    
    public DateTime? UpdatedAt { get; set; }
    public string? MeetingLink { get; set; }
    public virtual CoachProfile? Coach { get; set; }

    public virtual MemberProfile? Member { get; set; }
}
