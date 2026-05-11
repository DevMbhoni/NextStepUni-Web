using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using NextStepUni.Domain.Entities;
using NextStepUni.Domain.Enums;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.Infrastructure.Services;

public class StudentService : IStudentService
{
    private readonly AppDbContext _db;

    public StudentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<StudentProfileDto?> GetProfileAsync(Guid userId)
    {
        var user = await _db.Users
            .Include(u => u.StudentProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null) return null;

        var latest = await GetLatestResultsAsync(userId);

        return new StudentProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Province = user.StudentProfile?.Province,
            FieldOfStudyInterest = user.StudentProfile?.FieldOfStudyInterest,
            SchoolName = user.StudentProfile?.SchoolName,
            GraduationYear = user.StudentProfile?.GraduationYear,
            LatestResults = latest
        };
    }

    public async Task<StudentProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
    {
        var profile = await _db.StudentProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new Exception("Student profile not found.");

        profile.Province = dto.Province;
        profile.FieldOfStudyInterest = dto.FieldOfStudyInterest;
        profile.SchoolName = dto.SchoolName;
        profile.GraduationYear = dto.GraduationYear;

        await _db.SaveChangesAsync();

        return (await GetProfileAsync(userId))!;
    }

    public async Task<LatestResultsDto> UploadResultsAsync(Guid userId, UploadResultsDto dto)
    {
        if (!Enum.TryParse<UploadType>(dto.UploadType, out var uploadType))
            throw new ArgumentException("Invalid upload type. Use: Grade11Final, Grade12Mid, or Grade12Final.");

        var profile = await _db.StudentProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new Exception("Student profile not found.");

        var existing = await _db.ResultUploads
            .Where(r => r.StudentProfileId == profile.Id && r.UploadType == uploadType)
            .ToListAsync();

        foreach (var old in existing)
            old.IsLatest = false;

        var subjectIds = dto.Subjects.Select(s => s.SubjectId).ToList();
        var subjects = await _db.Subjects
            .Where(s => subjectIds.Contains(s.Id))
            .ToListAsync();

        var upload = new ResultUpload
        {
            Id = Guid.NewGuid(),
            StudentProfileId = profile.Id,
            UploadType = uploadType,
            IsLatest = true,
            UploadedAt = DateTime.UtcNow
        };

        var results = dto.Subjects.Select(s =>
        {
            var pct = s.Percentage;
            return new StudentSubjectResult
            {
                Id = Guid.NewGuid(),
                ResultUploadId = upload.Id,
                SubjectId = s.SubjectId,
                Percentage = pct,
                Level = PercentageToLevel(pct)
            };
        }).ToList();

        upload.SubjectResults = results;

        upload.CalculatedAverage = results.Any()
            ? Math.Round(results.Average(r => r.Percentage), 2)
            : null;

        upload.CalculatedAps = CalculateStandardAps(results, subjects);

        _db.ResultUploads.Add(upload);
        await _db.SaveChangesAsync();

        return MapToLatestResultsDto(upload, subjects);
    }

    public async Task<LatestResultsDto?> GetLatestResultsAsync(Guid userId)
    {
        var profile = await _db.StudentProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile is null) return null;

        var upload = await _db.ResultUploads
            .Include(r => r.SubjectResults)
                .ThenInclude(sr => sr.Subject)
            .Where(r => r.StudentProfileId == profile.Id && r.IsLatest)
            .OrderByDescending(r => r.UploadedAt)
            .FirstOrDefaultAsync();

        if (upload is null) return null;

        var subjects = upload.SubjectResults.Select(r => r.Subject).ToList();
        return MapToLatestResultsDto(upload, subjects);
    }

    private static int PercentageToLevel(decimal pct) => pct switch
    {
        >= 80 => 7,
        >= 70 => 6,
        >= 60 => 5,
        >= 50 => 4,
        >= 40 => 3,
        >= 30 => 2,
        _ => 1
    };

    private static decimal CalculateStandardAps(
        List<StudentSubjectResult> results,
        List<Subject> subjects)
    {
        return results
            .OrderByDescending(r => r.Level)
            .Take(6)
            .Sum(r => r.Level);
    }

    private static LatestResultsDto MapToLatestResultsDto(
        ResultUpload upload, IEnumerable<Subject> subjects)
    {
        var subjectMap = subjects.ToDictionary(s => s.Id);

        return new LatestResultsDto
        {
            UploadId = upload.Id,
            UploadType = upload.UploadType.ToString(),
            CalculatedAverage = upload.CalculatedAverage,
            CalculatedAps = upload.CalculatedAps,
            UploadedAt = upload.UploadedAt,
            Subjects = upload.SubjectResults.Select(r =>
            {
                subjectMap.TryGetValue(r.SubjectId, out var subject);
                return new SubjectResultDto
                {
                    SubjectId = r.SubjectId,
                    SubjectName = subject?.Name ?? "Unknown",
                    Category = subject?.Category ?? "",
                    Percentage = r.Percentage,
                    Level = r.Level
                };
            }).OrderByDescending(s => s.Percentage).ToList()
        };
    }
}