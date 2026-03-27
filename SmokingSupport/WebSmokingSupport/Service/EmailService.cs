using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using MimeKit;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;

namespace WebSmokingSupport.Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                Console.WriteLine($"[EmailService] Bắt đầu gửi email đến: {toEmail}");

                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configuration["EmailSettings:From"]));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;
                email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

                using var smtp = new MailKit.Net.Smtp.SmtpClient();

                Console.WriteLine("[EmailService] Đang kết nối SMTP...");
                await smtp.ConnectAsync(
                    _configuration["EmailSettings:SmtpServer"],
                    int.Parse(_configuration["EmailSettings:Port"]),
                    MailKit.Security.SecureSocketOptions.SslOnConnect // dùng SSL đúng với port 465
                );
                Console.WriteLine("[EmailService] Đã kết nối SMTP");

                Console.WriteLine("[EmailService] Đang xác thực...");
                await smtp.AuthenticateAsync(
                    _configuration["EmailSettings:Username"],
                    _configuration["EmailSettings:Password"]
                );
                Console.WriteLine("[EmailService] Xác thực thành công");

                Console.WriteLine("[EmailService] Đang gửi email...");
                await smtp.SendAsync(email);
                Console.WriteLine("[EmailService] Gửi email thành công");

                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] ❌ Lỗi gửi email: {ex.Message}");
                throw;
            }
        }
    }
}