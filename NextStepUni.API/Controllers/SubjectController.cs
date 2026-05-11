using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectController : ControllerBase
{
    private readonly AppDbContext _db;

    public SubjectController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subjects = await _db.Subjects
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                Name = s.Name,
                Category = s.Category,
                IsCompulsory = s.IsCompulsory,
                IsLanguage = s.IsLanguage,
                IsLifeOrientation = s.IsLifeOrientation
            })
            .ToListAsync();

        var grouped = subjects
            .GroupBy(s => s.Category)
            .ToDictionary(g => g.Key, g => g.ToList());

        return Ok(grouped);
    }

    [HttpGet("flat")]
    public async Task<IActionResult> GetFlat()
    {
        var subjects = await _db.Subjects
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                Name = s.Name,
                Category = s.Category,
                IsCompulsory = s.IsCompulsory,
                IsLanguage = s.IsLanguage,
                IsLifeOrientation = s.IsLifeOrientation
            })
            .ToListAsync();

        return Ok(subjects);
    }
}