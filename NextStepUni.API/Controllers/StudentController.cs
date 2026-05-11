using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using System.Security.Claims;

namespace NextStepUni.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var result = await _studentService.GetProfileAsync(userId);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = GetUserId();
        var result = await _studentService.UpdateProfileAsync(userId, dto);
        return Ok(result);
    }

    [HttpPost("results")]
    public async Task<IActionResult> UploadResults([FromBody] UploadResultsDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _studentService.UploadResultsAsync(userId, dto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("results")]
    public async Task<IActionResult> GetLatestResults()
    {
        var userId = GetUserId();
        var result = await _studentService.GetLatestResultsAsync(userId);
        if (result is null)
            return NotFound(new { message = "No results uploaded yet." });
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(claim!);
    }
}