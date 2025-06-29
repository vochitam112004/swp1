﻿using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class MemberGoal
{
    public int MemberGoalId { get; set; }

    public int? MemberId { get; set; }

    public int? GoalId { get; set; }

    public string? Status { get; set; }

    public virtual GoalPlan? Goal { get; set; }

    public virtual MemberProfile? Member { get; set; }
}
