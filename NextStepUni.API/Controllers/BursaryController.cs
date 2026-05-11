using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using System.Security.Claims;

namespace NextStepUni.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BursaryController : ControllerBase
{
    private readonly IBursaryService _bursaryService;

    public BursaryController(IBursaryService bursaryService)
    {
        _bursaryService = bursaryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] BursaryFilterDto filter)
    {
        var userId = GetUserId();
        var result = await _bursaryService.GetAllAsync(filter, userId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var result = await _bursaryService.GetByIdAsync(id, userId);

        if (result is null)
            return NotFound(new { message = "Bursary not found." });

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/favourite")]
    public async Task<IActionResult> ToggleFavourite(Guid id)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var isFavourited = await _bursaryService.ToggleFavouriteAsync(id, userId.Value);

        return Ok(new
        {
            isFavourited,
            message = isFavourited ? "Bursary saved." : "Bursary removed from saved."
        });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}