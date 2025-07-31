using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSmokingSupport.Entity;

public partial class TriggerFactor
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TriggerId { get; set; }

    public string? Name { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<MemberTrigger> MemberTriggers { get; set; } = new List<MemberTrigger>();
}
