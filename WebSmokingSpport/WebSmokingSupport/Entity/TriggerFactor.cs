using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class TriggerFactor
{
    public int TriggerId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<MemberTrigger> MemberTriggers { get; set; } = new List<MemberTrigger>();
}
