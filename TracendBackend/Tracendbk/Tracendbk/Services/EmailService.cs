using System.Net.Mail;
using System.Net;

namespace Tracendbk.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using (var message = new MailMessage("your_email@gmail.com", toEmail))
            {
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;

                using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential("ainaa0018@gmail.com", "unjm bwdr zvbp ofxn");
                    smtp.EnableSsl = true;
                    await smtp.SendMailAsync(message);
                }
            }
        }
    }
}
