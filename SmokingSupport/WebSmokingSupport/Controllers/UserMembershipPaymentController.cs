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

            // Kiểm tra trạng thái giao dịch từ Momo
            collection.TryGetValue("resultCode", out var resultCode);
            if (resultCode != "0")
            {
                return BadRequest("Thanh toán thất bại hoặc bị hủy.");
            }

            // Lấy các tham số cần thiết
            collection.TryGetValue("amount", out var amount);
            collection.TryGetValue("orderInfo", out var orderInfo);
            collection.TryGetValue("orderId", out var orderId);

            // Tách userId - planId từ orderInfo 
            var parts = orderInfo.ToString().Split("-");
            if (parts.Length != 2) return BadRequest("Thông tin orderInfo không hợp lệ");

             if (!int.TryParse(parts[0], out int userId) || !int.TryParse(parts[1], out int planId))
        return BadRequest("UserId hoặc PlanId không hợp lệ.");
            // Lấy plan từ DB
            var plan = await _context.MembershipPlans.FindAsync(planId);
            if (plan == null) return NotFound("Không tìm thấy gói");

            var now = DateTime.Now;
            var endDate = now.AddDays(plan.DurationDays); // hoặc AddDays(30)

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
                Status = "Success",
                Message = "Giao dịch Momo đã được xử lý thành công",
                Amount = amount,
                OrderId = orderId,
                OrderInfo = orderInfo,
                FullName = "" // nếu cần
            });
        }

    }
}
