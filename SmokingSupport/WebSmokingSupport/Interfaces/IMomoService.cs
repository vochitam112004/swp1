using WebSmokingSupport.Entity;

namespace WebSmokingSupport.Interfaces
{
    public interface IMomoService
    {
        Task<MomoCreatePaymentResponseModel> CreatePaymentMomo(OrderInfoModel model);
        MomoExecuteResponseModel PaymentExecuteAsync(IQueryCollection collection);

    }
}
