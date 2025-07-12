﻿using System;
using System.Collections.Generic;

namespace WebSmokingSupport.Entity;

public partial class PasswordResetToken
{
    public int TokenId { get; set; }

    public int UserId { get; set; }

    public string? OtpCode { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public bool? IsUsed { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
