using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using NextStepUni.Application.Interfaces;

namespace NextStepUni.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendPasswordResetEmailAsync(
        string toEmail, string firstName, string resetToken)
    {
        var frontendUrl = _config["Frontend:BaseUrl"];
        var resetLink = $"{frontendUrl}/reset-password?token={resetToken}";

        var subject = "Reset your NextStepUni password";
        var body = $@"
            <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>
                <div style='background:#0f1b35;padding:24px;text-align:center;'>
                    <h1 style='color:#b8f53c;margin:0;'>NextStepUni</h1>
                </div>
                <div style='padding:32px;background:#f9f9f9;'>
                    <h2 style='color:#0f1b35;'>Hi {firstName},</h2>
                    <p style='color:#444;font-size:15px;line-height:1.6;'>
                        We received a request to reset your password.
                        Click the button below to choose a new password.
                        This link expires in 1 hour.
                    </p>
                    <div style='text-align:center;margin:32px 0;'>
                        <a href='{resetLink}'
                           style='background:#b8f53c;color:#0f1b35;padding:14px 32px;
                                  border-radius:8px;text-decoration:none;
                                  font-weight:700;font-size:15px;'>
                            Reset Password
                        </a>
                    </div>
                    <p style='color:#888;font-size:13px;'>
                        If you did not request this you can safely ignore this email.
                    </p>
                    <p style='color:#888;font-size:12px;margin-top:16px;'>
                        Or copy this link: {resetLink}
                    </p>
                </div>
                <div style='background:#0f1b35;padding:16px;text-align:center;'>
                    <p style='color:#8899bb;font-size:12px;margin:0;'>
                        NextStepUni — Helping students find their path
                    </p>
                </div>
            </div>";

        await SendAsync(toEmail, subject, body);
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string firstName)
    {
        var subject = "Welcome to NextStepUni!";
        var body = $@"
            <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>
                <div style='background:#0f1b35;padding:24px;text-align:center;'>
                    <h1 style='color:#b8f53c;margin:0;'>NextStepUni</h1>
                </div>
                <div style='padding:32px;background:#f9f9f9;'>
                    <h2 style='color:#0f1b35;'>Welcome, {firstName}!</h2>
                    <p style='color:#444;font-size:15px;line-height:1.6;'>
                        Your account has been created successfully. You can now:
                    </p>
                    <ul style='color:#444;font-size:15px;line-height:2;'>
                        <li>Browse universities and bursaries</li>
                        <li>Upload your subject results</li>
                        <li>Get personalised recommendations</li>
                        <li>Save your favourites</li>
                    </ul>
                    <div style='text-align:center;margin:32px 0;'>
                        <a href='{_config["Frontend:BaseUrl"]}'
                           style='background:#b8f53c;color:#0f1b35;padding:14px 32px;
                                  border-radius:8px;text-decoration:none;
                                  font-weight:700;font-size:15px;'>
                            Get Started
                        </a>
                    </div>
                </div>
                <div style='background:#0f1b35;padding:16px;text-align:center;'>
                    <p style='color:#8899bb;font-size:12px;margin:0;'>
                        NextStepUni — Helping students find their path
                    </p>
                </div>
            </div>";

        await SendAsync(toEmail, subject, body);
    }

    private async Task SendAsync(string toEmail, string subject, string htmlBody)
    {
        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(
            _config["Email:FromName"],
            _config["Email:FromEmail"]));

        message.To.Add(new MailboxAddress(string.Empty, toEmail));
        message.Subject = subject;

        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();

        await client.ConnectAsync(
            _config["Email:Host"],
            int.Parse(_config["Email:Port"]!),
            SecureSocketOptions.StartTls);

        await client.AuthenticateAsync(
            _config["Email:FromEmail"],
            _config["Email:Password"]);

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}