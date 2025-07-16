using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Service.Momo;

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
            return Redirect(response.PayUrl);
        }

        [HttpGet]
        [Route("PaymentExecute")]
        public IActionResult PaymentCallBack()
        {
            var response = _momoService.PaymentExecuteAsync(HttpContext.Request.Query);
            return Ok(response);
        }

    }
}
