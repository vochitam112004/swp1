using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class MemberTrigger
{
    public int MemberTriggerId { get; set; }

    public int? MemberId { get; set; }

    public int? TriggerId { get; set; }

    public virtual MemberProfile? Member { get; set; }

    public virtual TriggerFactor? Trigger { get; set; }
}
