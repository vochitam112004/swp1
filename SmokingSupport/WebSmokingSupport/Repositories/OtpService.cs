using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;
using WebSmokingSupport.Interfaces;
namespace WebSmokingSupport.Repositories
{
    public class OtpService : IOtpService
    {
        private readonly IMemoryCache _cache;

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public Task SaveOtpAsync(string email, string otp)
        {
            _cache.Set(email, otp, TimeSpan.FromMinutes(5)); // OTP có hiệu lực 5 phút
            return Task.CompletedTask;
        }

        public Task<bool> VerifyOtpAsync(string email, string otp)
        {
            if (_cache.TryGetValue(email, out string savedOtp))
            {
                return Task.FromResult(savedOtp == otp);
            }
            return Task.FromResult(false);
        }
    }
}
