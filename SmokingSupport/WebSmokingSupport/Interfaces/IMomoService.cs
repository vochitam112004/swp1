using WebSmokingSupport.Entity;
using WebSmokingSupport.Entity.Momo;

namespace WebSmokingSupport.Service.Momo
{
    public interface IMomoService
    {
        Task<MomoCreatePaymentResponseModel> CreatePaymentMomo(OrderInfoModel model);
        MomoExecuteResponseModel PaymentExecuteAsync(IQueryCollection collection);

    }
}
