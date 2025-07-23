using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMembershipPaymentController : ControllerBase
    {
        private readonly IMomoService _momoService;
        private readonly QuitSmokingSupportContext _context;

        public UserMembershipPaymentController(IMomoService momoService, QuitSmokingSupportContext context)
        {
            _momoService = momoService;
            _context = context;
        }
        [HttpPost]
        [Route("CreatePaymentUrl")]
        public async Task<IActionResult> CreatePaymentMomo(OrderInfoModel model)
        {
            // OrderInfo được generate tự động từ model
            var response = await _momoService.CreatePaymentMomo(model);
            return Ok(new { PayUrl = response.PayUrl });
        }

        [HttpGet]
        [Route("PaymentExecute")]
        public async Task<IActionResult> PaymentCallBack()
        {
            var collection = HttpContext.Request.Query;

            collection.TryGetValue("amount", out var amount);
            collection.TryGetValue("orderInfo", out var orderInfo);
            collection.TryGetValue("orderId", out var orderId);

            // Tách userId - planId từ orderInfo (ví dụ "5-2")
            var parts = orderInfo.ToString().Split("-");
            if (parts.Length != 2) return BadRequest("Thông tin orderInfo không hợp lệ");

            int userId = int.Parse(parts[0]);
            int planId = int.Parse(parts[1]);

            // Lấy plan từ DB
            var plan = await _context.MembershipPlans.FindAsync(planId);
            if (plan == null) return NotFound("Không tìm thấy gói");

            var now = DateTime.Now;
            var endDate = now.AddDays(plan.DurationInDays); // hoặc AddDays(30)

            var history = new UserMembershipHistory
            {
                UserId = userId,
                PlanId = planId,
                StartDate = now,
                EndDate = endDate
            };

            _context.UserMembershipHistories.Add(history);
            await _context.SaveChangesAsync();

            return Ok(new MomoExecuteResponseModel()
            {
                Amount = amount,
                OrderId = orderId,
                OrderInfo = orderInfo,
                FullName = "" // nếu cần
            });
        }

    }
}
