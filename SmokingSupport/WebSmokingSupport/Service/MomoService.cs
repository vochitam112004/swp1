// WebSmokingSupport.Service/MomoService.cs (Đã sửa đổi)
using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RestSharp;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;

namespace WebSmokingSupport.Service
{
    public class MomoService : IMomoService
    {
        private readonly IOptions<MomoOptionModel> _options;
        public MomoService(IOptions<MomoOptionModel> options)
        {
            _options = options;
        }

        public async Task<MomoCreatePaymentResponseModel> CreatePaymentMomo(OrderInfoModel model)
        {
            model.OrderId = DateTime.UtcNow.Ticks.ToString();
            // OrderInfo bây giờ trực tiếp chứa "userId-planId"
            var fullOrderInfo = $"Mua gói thành viên cho User: {model.UserId}, Gói: {model.PlanId}.";

            var rawData =
             $"partnerCode={_options.Value.PartnerCode}" +
             $"&accessKey={_options.Value.AccessKey}" +
             $"&requestId={model.OrderId}" +
             $"&amount={model.Amount}" +
             $"&orderId={model.OrderId}" +
             $"&orderInfo={model.OrderInfo}" + // Sử dụng model.OrderInfo trực tiếp ở đây
             $"&returnUrl={_options.Value.ReturnUrl}" +
             $"&notifyUrl={_options.Value.NotifyUrl}" +
             $"&extraData="; // Giữ extraData trống như ban đầu, hoặc thêm vào nếu cần

            var signature = ComputeHmacSha256(rawData, _options.Value.SecretKey);
            var client = new RestClient(_options.Value.MomoApiUrl);
            var request = new RestRequest() { Method = Method.POST };
            request.AddHeader("Content-Type", "application/json; charset=UTF-8");

            // Tạo một đối tượng đại diện cho dữ liệu yêu cầu
            var requestData = new
            {
                accessKey = _options.Value.AccessKey,
                partnerCode = _options.Value.PartnerCode,
                requestType = _options.Value.RequestType,
                notifyUrl = _options.Value.NotifyUrl,
                returnUrl = _options.Value.ReturnUrl,//thay doi
                orderId = model.OrderId,
                amount = model.Amount.ToString(),
                orderInfo = model.OrderInfo, // Sử dụng model.OrderInfo ở đây
                requestId = model.OrderId,
                extraData = "",
                signature
            };

            request.AddParameter("application/json", JsonConvert.SerializeObject(requestData), ParameterType.RequestBody);

            var response = await client.ExecuteAsync(request);
            if (!response.IsSuccessful)
            {
                throw new Exception("Không thể gọi API MoMo: " + response.Content);
            }

            var momoResponse = JsonConvert.DeserializeObject<MomoCreatePaymentResponseModel>(response.Content);
            return momoResponse;
        }

        public MomoExecuteResponseModel PaymentExecuteAsync(IQueryCollection collection)
        {
            // Phương thức này dường như là một trình xử lý gọi lại cũ/không được sử dụng.
            // Logic gọi lại chính hiện nằm trong UserMembershipPaymentController.PaymentCallBack().
            // Bạn có thể muốn xóa phương thức này nếu nó không được sử dụng ở nơi khác.
            var amount = collection.First(s => s.Key == "amount").Value;
            var orderInfo = collection.First(s => s.Key == "orderInfo").Value;
            var orderId = collection.First(s => s.Key == "orderId").Value;

            return new MomoExecuteResponseModel()
            {
                Amount = amount.ToString(),
                OrderId = orderId.ToString(),
                OrderInfo = orderInfo.ToString(),
                Status = "Unknown", // Mặc định hoặc xác định dựa trên collection
                Message = "Được xử lý bởi dịch vụ (không dùng nữa hoặc sử dụng nội bộ)"
            };
        }

        private string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = Encoding.UTF8.GetBytes(message);

            byte[] hashBytes;

            using (var hmac = new System.Security.Cryptography.HMACSHA256(keyBytes))
            {
                hashBytes = hmac.ComputeHash(messageBytes);
            }
            var hashString = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            return hashString;
        }
    }
}