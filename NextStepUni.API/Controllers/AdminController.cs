using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;

namespace NextStepUni.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var result = await _adminService.GetOverviewAsync();
        return Ok(result);
    }

    [HttpPost("universities")]
    public async Task<IActionResult> CreateUniversity([FromBody] CreateUniversityDto dto)
    {
        try
        {
            var result = await _adminService.CreateUniversityAsync(dto);
            return CreatedAtAction(nameof(CreateUniversity), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("universities/{id:guid}")]
    public async Task<IActionResult> UpdateUniversity(Guid id, [FromBody] UpdateUniversityDto dto)
    {
        try
        {
            var result = await _adminService.UpdateUniversityAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("universities/{id:guid}")]
    public async Task<IActionResult> DeleteUniversity(Guid id)
    {
        try
        {
            await _adminService.DeleteUniversityAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("faculties")]
    public async Task<IActionResult> CreateFaculty([FromBody] CreateFacultyDto dto)
    {
        var result = await _adminService.CreateFacultyAsync(dto);
        return Ok(result);
    }

    [HttpDelete("faculties/{id:guid}")]
    public async Task<IActionResult> DeleteFaculty(Guid id)
    {
        try
        {
            await _adminService.DeleteFacultyAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("qualifications")]
    public async Task<IActionResult> CreateQualification([FromBody] CreateQualificationDto dto)
    {
        var result = await _adminService.CreateQualificationAsync(dto);
        return Ok(result);
    }

    [HttpDelete("qualifications/{id:guid}")]
    public async Task<IActionResult> DeleteQualification(Guid id)
    {
        try
        {
            await _adminService.DeleteQualificationAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("subject-requirements")]
    public async Task<IActionResult> AddSubjectRequirement(
        [FromBody] CreateSubjectRequirementDto dto)
    {
        await _adminService.AddSubjectRequirementAsync(dto);
        return Ok(new { message = "Subject requirement added." });
    }

    [HttpDelete("subject-requirements/{id:guid}")]
    public async Task<IActionResult> DeleteSubjectRequirement(Guid id)
    {
        try
        {
            await _adminService.DeleteSubjectRequirementAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("bursaries")]
    public async Task<IActionResult> CreateBursary([FromBody] CreateBursaryDto dto)
    {
        var result = await _adminService.CreateBursaryAsync(dto);
        return Ok(result);
    }

    [HttpPut("bursaries/{id:guid}")]
    public async Task<IActionResult> UpdateBursary(Guid id, [FromBody] UpdateBursaryDto dto)
    {
        try
        {
            var result = await _adminService.UpdateBursaryAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("bursaries/{id:guid}")]
    public async Task<IActionResult> DeleteBursary(Guid id)
    {
        try
        {
            await _adminService.DeleteBursaryAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetStudents([FromQuery] string? searchTerm)
    {
        var result = await _adminService.GetStudentsAsync(searchTerm);
        return Ok(result);
    }

    [HttpPatch("students/{id:guid}/toggle-active")]
    public async Task<IActionResult> ToggleStudentActive(Guid id)
    {
        try
        {
            var isActive = await _adminService.ToggleStudentActiveAsync(id);
            return Ok(new
            {
                isActive,
                message = isActive ? "Student account activated." : "Student account deactivated."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}