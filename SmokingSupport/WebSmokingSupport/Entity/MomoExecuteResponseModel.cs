﻿namespace WebSmokingSupport.Entity
{
    public class MomoExecuteResponseModel
    {
        public string OrderId { get; set; }
        public string? Amount { get; set; }
        public string FullName { get; set; }
        public string OrderInfo { get; set; }
        public string Status { get; set; } // Success / Failed
        public string Message { get; set; }
    }

}