namespace NextStepUni.Application.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(string toEmail, string firstName, string resetToken);
    Task SendWelcomeEmailAsync(string toEmail, string firstName);
}