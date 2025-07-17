using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;

namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMembershipPaymentController : ControllerBase
    {
        private readonly IMomoService _momoService;

        public UserMembershipPaymentController(IMomoService momoService)
        {
            _momoService = momoService;
        }
        [HttpPost]
        [Route("CreatePaymentUrl")]
        public async Task<IActionResult> CreatePaymentMomo(OrderInfoModel model)
        {
            var response = await _momoService.CreatePaymentMomo(model);
            return Ok(new { PayUrl = response.PayUrl });
        }

        [HttpGet]
        [Route("PaymentExecute")]
        public IActionResult PaymentCallBack()
        {
            var collection = HttpContext.Request.Query;

            collection.TryGetValue("amount", out var amount);
            collection.TryGetValue("orderInfo", out var orderInfo);
            collection.TryGetValue("orderId", out var orderId);

            return Ok(new MomoExecuteResponseModel()
            {
                Amount = amount,
                OrderId = orderId,
                OrderInfo = orderInfo,
                FullName = "" 
            });
        }

    }
}
