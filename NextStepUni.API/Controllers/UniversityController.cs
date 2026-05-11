using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using System.Security.Claims;

namespace NextStepUni.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UniversityController : ControllerBase
{
    private readonly IUniversityService _universityService;

    public UniversityController(IUniversityService universityService)
    {
        _universityService = universityService;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] UniversityFilterDto filter)
    {
        var userId = GetUserId();
        var result = await _universityService.GetAllAsync(filter, userId);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var result = await _universityService.GetByIdAsync(id, userId);

        if (result is null)
            return NotFound(new { message = "University not found." });

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/favourite")]
    public async Task<IActionResult> ToggleFavourite(Guid id)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var isFavourited = await _universityService.ToggleFavouriteAsync(id, userId.Value);

        return Ok(new
        {
            isFavourited,
            message = isFavourited ? "University saved." : "University removed from saved."
        });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}