using Microsoft.AspNetCore.Mvc;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using System.Security.Claims;

namespace NextStepUni.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatbotController : ControllerBase
{
    private readonly IChatbotService _chatbotService;

    public ChatbotController(IChatbotService chatbotService)
    {
        _chatbotService = chatbotService;
    }

    
    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Message cannot be empty." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userId = Guid.TryParse(userIdClaim, out var id) ? id : (Guid?)null;

        var response = await _chatbotService.ProcessMessageAsync(request.Message, userId);
        return Ok(response);
    }
}