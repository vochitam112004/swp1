// WebSmokingSupport.Controllers/UserMembershipPaymentController.cs (Đã sửa đổi)
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Security.Claims; // Đã thêm cho User.FindFirstValue

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
        [Route("CreatePaymentForPlan/{planId}")]
        [Authorize] // Đảm bảo người dùng đã xác thực
        public async Task<IActionResult> CreatePaymentMomo(int planId)
        {
            // Lấy UserId từ mã thông báo của người dùng đã xác thực
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier); // Hoặc bất kỳ loại yêu cầu nào bạn sử dụng cho ID người dùng
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized("Không tìm thấy ID người dùng trong mã thông báo.");
            }

            // Lấy gói từ DB
            var plan = await _context.MembershipPlans.FindAsync(planId);
            if (plan == null)
            {
                return NotFound($"Không tìm thấy gói thành viên có ID {planId}.");
            }

            var model = new OrderInfoModel
            {
                Amount = (long)plan.Price,
                UserId = userId,
                PlanId = planId,
                // OrderInfo sẽ được định dạng là "userId-planId" để phân tích cú pháp gọi lại
                OrderInfo = $"{userId}-{planId}"
            };

            var response = await _momoService.CreatePaymentMomo(model);

            if (response.ErrorCode != 0)
            {
                // Ghi nhật ký lỗi để gỡ lỗi
                return StatusCode(500, new { Message = "Không thể tạo URL thanh toán MoMo.", MomoError = response.Message });
            }

            return Ok(new { PayUrl = response.PayUrl, QrCodeUrl = response.QrCodeUrl });
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
            // Định dạng dự kiến là "userId-planId" dựa trên cách nó được gửi từ CreatePaymentMomo
            var parts = orderInfo.ToString().Split("-");
            if (parts.Length != 2)
            {
                return BadRequest("Thông tin orderInfo không hợp lệ. Định dạng mong muốn: 'userId-planId'");
            }

            if (!int.TryParse(parts[0], out int userId) || !int.TryParse(parts[1], out int planId))
            {
                return BadRequest("UserId hoặc PlanId không hợp lệ trong orderInfo.");
            }

            // Lấy plan từ DB
            var plan = await _context.MembershipPlans.FindAsync(planId);
            if (plan == null)
            {
                return NotFound("Không tìm thấy gói thành viên tương ứng.");
            }

            var now = DateTime.Now;
            var endDate = now.AddDays(plan.DurationDays);

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
                Message = "Giao dịch MoMo đã được xử lý thành công",
                Amount = amount.ToString(), // Đảm bảo amount là string theo MomoExecuteResponseModel
                OrderId = orderId.ToString(),
                OrderInfo = orderInfo.ToString(),
                FullName = "" // FullName có thể để trống hoặc lấy từ dịch vụ người dùng nếu cần
            });
        }
    }
}