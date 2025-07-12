using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using Microsoft.AspNetCore.Authorization;
using WebSmokingSupport.DTOs;
using System.Security.Claims;
using WebSmokingSupport.Repositories;
using WebSmokingSupport.Data;
using System.Numerics;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMembershipPaymentController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<UserMembershipPayment> _userMembershipPaymentRepository;
        private readonly IGenericRepository<UserMembershipHistory> _userMembershipHistoryRepository;
        private readonly IGenericRepository<MembershipPlan> _membershipPlanRepository;
        public UserMembershipPaymentController(
            QuitSmokingSupportContext context,
            IGenericRepository<UserMembershipPayment> userMembershipPaymentRepository,
            IGenericRepository<UserMembershipHistory> userMembershipHistoryRepository,
            IGenericRepository<MembershipPlan> membershipPlanRepository)
        {
            _userMembershipPaymentRepository = userMembershipPaymentRepository;
            _userMembershipHistoryRepository = userMembershipHistoryRepository;
            _membershipPlanRepository = membershipPlanRepository;
            _context = context;
        }
        /// <summary>
        /// Xử lý yêu cầu xác nhận thanh toán sau khi người dùng đã quét QR và thanh toán xong.
        /// </summary>
        /// <param name="dto">Thông tin thanh toán từ client (PlanId, Amount, TransactionId).</param>
        /// <returns>Phản hồi thành công/thất bại của thanh toán và thông tin gói.</returns>
        [HttpPost("process-payment")]
        [Authorize(Roles = "Member")]   
        public async Task<ActionResult<DTOPaymentSuccessResponse>> ProcessPayment([FromBody] DTOUserMembershipPaymentForCreate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var membershipPlan = await _membershipPlanRepository.GetByIdAsync(dto.PlanId);
                if (membershipPlan == null)
                {
                    return NotFound($"Gói thành viên với ID {dto.PlanId} không tìm thấy.");
                }
                if (dto.Amount != membershipPlan.Price)
                {
                    return BadRequest("Số tiền thanh toán không khớp với giá gói.");
                }
                bool isPaymentSuccessful = await VerifyPaymentWithGateway(dto.TransactionId, dto.Amount);
                Console.WriteLine($"Payment verification result: {isPaymentSuccessful}"); 

                var paymentStatus = isPaymentSuccessful ? "Success" : "Failed";
                var now = DateTime.UtcNow;
                var payment = new UserMembershipPayment
                {
                    UserId = userId,
                    PlanId = membershipPlan.PlanId ?? 0, 
                    Amount = dto.Amount,
                    PaymentDate = now,
                    // ExpirationDate của Payment là ngày hết hạn của gói nếu thành công, hoặc ngay bây giờ nếu thất bại
                    ExpirationDate = isPaymentSuccessful ? now.AddDays(membershipPlan.DurationDays) : now,
                    PaymentStatus = paymentStatus,
                    TransactionId = dto.TransactionId,
                };
                await _userMembershipPaymentRepository.CreateAsync(payment); 
                DTOUserMemberShipHistoryForRead? membershipHistoryReadDto = null;

                // 5. CHỈ KHI THANH TOÁN THÀNH CÔNG MỚI LƯU HOẶC GIA HẠN LỊCH SỬ GÓI THÀNH VIÊN
                if (isPaymentSuccessful)
                {
                    var existingHistory = await _context.UserMembershipHistories
                                                        .FirstOrDefaultAsync(h => h.UserId == userId && h.EndDate > DateTime.UtcNow);

                    DateTime historyStartDate;
                    DateTime historyEndDate;

                    if (existingHistory != null)
                    {
                        historyStartDate = existingHistory.EndDate > now ? existingHistory.EndDate : now;
                    }
                    else
                    {
                        historyStartDate = now;
                    }

                    historyEndDate = historyStartDate.AddDays(membershipPlan.DurationDays);

                    var userMembershipHistory = new UserMembershipHistory
                    {
                        UserId = userId,
                        PlanId = membershipPlan.PlanId,
                        StartDate = historyStartDate,
                        EndDate = historyEndDate
                    };

                    await _userMembershipHistoryRepository.CreateAsync(userMembershipHistory);

                    // Trả DTO về client
                    membershipHistoryReadDto = new DTOUserMemberShipHistoryForRead
                    {
                        HistoryId = userMembershipHistory.HistoryId,
                        UserId = userMembershipHistory.UserId,
                        PlanId = userMembershipHistory.PlanId ?? 0,
                        StartDate = userMembershipHistory.StartDate,
                        EndDate = userMembershipHistory.EndDate,
                        PlanName = membershipPlan.Name,
                        Price = membershipPlan.Price
                    };
                }

                // 6. Chuẩn bị DTO phản hồi cuối cùng
                if (isPaymentSuccessful)
                {
                    var paymentReadDto = new DTOUserMembershipPaymentForRead
                    {
                        PaymentId = payment.PaymentId,
                        UserId = payment.UserId,
                        PlanId = payment.PlanId,
                        PlanName = membershipPlan.Name,
                        PlanPrice = membershipPlan.Price,
                        PaymentDate = payment.PaymentDate,
                        ExpirationDate = payment.ExpirationDate,
                        Amount = payment.Amount,
                        PaymentStatus = payment.PaymentStatus,
                        TransactionId = payment.TransactionId,
                        // Lấy DisplayName của User
                        UserName = (await _context.Users.FindAsync(userId))?.DisplayName ?? "Unknown User"
                    };

                    return Ok(new DTOPaymentSuccessResponse
                    {
                        Message = "Thanh toán thành công và gói thành viên đã được kích hoạt.",
                        PaymentDetails = paymentReadDto,
                        MembershipHistoryDetails = membershipHistoryReadDto!
                    });
                }
                else
                {
                    // Nếu thanh toán thất bại, trả về BadRequest
                    return BadRequest(new DTOPaymentFailureResponse
                    {
                        Message = "Thanh toán thất bại.",
                        ErrorDetails = "Giao dịch không thành công. Vui lòng kiểm tra lại thông tin hoặc thử lại."
                    });
                }
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi xử lý thanh toán: {ex.Message}");
            }
        }

        /// <summary>
        /// Phương thức giả lập/xác minh cổng thanh toán.
        /// TRONG THỰC TẾ: Bạn sẽ thay thế logic này bằng việc gọi API của cổng thanh toán thật
        /// để xác minh TransactionId và số tiền.
        /// </summary>
        /// <param name="transactionId">ID giao dịch từ phía client (sau khi thanh toán QR).</param>
        /// <param name="expectedAmount">Số tiền dự kiến của giao dịch.</param>
        /// <returns>True nếu thanh toán được xác minh thành công, False nếu không.</returns>
        private async Task<bool> VerifyPaymentWithGateway(string transactionId, decimal expectedAmount)
        {
            // Đây là nơi bạn sẽ gọi API của cổng thanh toán (ví dụ: Momo, ZaloPay, Stripe)
            // để kiểm tra trạng thái của TransactionId này.
            //
            // Ví dụ với Momo API:
            // var momoResponse = await _momoService.VerifyPayment(transactionId);
            // return momoResponse.Status == "SUCCESS" && momoResponse.Amount == expectedAmount;

            // Giả lập: Luôn thành công nếu transactionId không rỗng và số tiền khớp với một giá trị giả định.
            // Trong môi trường thật, bạn sẽ không kiểm tra 'expectedAmount' ở đây mà sẽ so sánh với số tiền mà cổng thanh toán báo về.
            // Để đơn giản cho mục đích giả lập:
            if (!string.IsNullOrEmpty(transactionId) && expectedAmount > 0)
            {
                // Giả lập một độ trễ để mô phỏng cuộc gọi API
                await Task.Delay(100);
                return true; // Giả lập thành công
            }
            return false; // Giả lập thất bại
        }
    }
}
