using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using NextStepUni.Domain.Entities;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AdminOverviewDto> GetOverviewAsync()
    {
        var now = DateTime.UtcNow;

        return new AdminOverviewDto
        {
            TotalUniversities = await _db.Universities.CountAsync(u => u.IsActive),
            TotalBursaries = await _db.Bursaries.CountAsync(),
            ActiveBursaries = await _db.Bursaries.CountAsync(b =>
                                       b.IsActive &&
                                       (!b.ApplicationDeadline.HasValue ||
                                        b.ApplicationDeadline >= now)),
            TotalStudents = await _db.Users.CountAsync(u =>
                                       u.Role == Domain.Enums.UserRole.Student),
            BursariesClosingSoon = await _db.Bursaries.CountAsync(b =>
                                       b.IsActive &&
                                       b.ApplicationDeadline.HasValue &&
                                       b.ApplicationDeadline >= now &&
                                       b.ApplicationDeadline <= now.AddDays(30)),
            NewStudentsThisWeek = await _db.Users.CountAsync(u =>
                                       u.Role == Domain.Enums.UserRole.Student &&
                                       u.CreatedAt >= now.AddDays(-7))
        };
    }

    public async Task<UniversityDetailDto> CreateUniversityAsync(CreateUniversityDto dto)
    {
        var university = new University
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Abbreviation = dto.Abbreviation?.Trim(),
            City = dto.City.Trim(),
            Province = dto.Province.Trim(),
            Description = dto.Description,
            Website = dto.Website,
            ApplicationLink = dto.ApplicationLink,
            LogoUrl = dto.LogoUrl,
            AnnualFeesFrom = dto.AnnualFeesFrom
        };

        var apsConfig = new UniversityApsConfig
        {
            Id = Guid.NewGuid(),
            UniversityId = university.Id,
            IncludesLifeOrientation = dto.ApsIncludesLifeOrientation,
            SubjectsCountedInAps = dto.ApsSubjectsCounted,
            Notes = dto.ApsNotes
        };

        var defaultScaleRules = new List<ApsScaleRule>
        {
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 80, MaxPercentage = 100, ApsPoints = 7 },
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 70, MaxPercentage = 79,  ApsPoints = 6 },
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 60, MaxPercentage = 69,  ApsPoints = 5 },
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 50, MaxPercentage = 59,  ApsPoints = 4 },
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 40, MaxPercentage = 49,  ApsPoints = 3 },
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 30, MaxPercentage = 39,  ApsPoints = 2 },
            new() { Id = Guid.NewGuid(), UniversityApsConfigId = apsConfig.Id, MinPercentage = 0,  MaxPercentage = 29,  ApsPoints = 1 },
        };

        _db.Universities.Add(university);
        _db.UniversityApsConfigs.Add(apsConfig);
        _db.ApsScaleRules.AddRange(defaultScaleRules);

        await _db.SaveChangesAsync();

        return (await new UniversityService(_db).GetByIdAsync(university.Id))!;
    }

    public async Task<UniversityDetailDto> UpdateUniversityAsync(Guid id, UpdateUniversityDto dto)
    {
        var university = await _db.Universities.FindAsync(id)
            ?? throw new KeyNotFoundException("University not found.");

        university.Name = dto.Name.Trim();
        university.Abbreviation = dto.Abbreviation?.Trim();
        university.City = dto.City.Trim();
        university.Province = dto.Province.Trim();
        university.Description = dto.Description;
        university.Website = dto.Website;
        university.ApplicationLink = dto.ApplicationLink;
        university.LogoUrl = dto.LogoUrl;
        university.AnnualFeesFrom = dto.AnnualFeesFrom;
        university.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();

        return (await new UniversityService(_db).GetByIdAsync(id))!;
    }

    public async Task DeleteUniversityAsync(Guid id)
    {
        var university = await _db.Universities.FindAsync(id)
            ?? throw new KeyNotFoundException("University not found.");

        university.IsActive = false;
        await _db.SaveChangesAsync();
    }

    public async Task<FacultyDto> CreateFacultyAsync(CreateFacultyDto dto)
    {
        var faculty = new Faculty
        {
            Id = Guid.NewGuid(),
            UniversityId = dto.UniversityId,
            Name = dto.Name.Trim(),
            Description = dto.Description
        };

        _db.Faculties.Add(faculty);
        await _db.SaveChangesAsync();

        return new FacultyDto
        {
            Id = faculty.Id,
            Name = faculty.Name,
            Description = faculty.Description,
            Qualifications = []
        };
    }

    public async Task DeleteFacultyAsync(Guid id)
    {
        var faculty = await _db.Faculties.FindAsync(id)
            ?? throw new KeyNotFoundException("Faculty not found.");

        faculty.IsActive = false;
        await _db.SaveChangesAsync();
    }

    public async Task<QualificationDto> CreateQualificationAsync(CreateQualificationDto dto)
    {
        var qualification = new Qualification
        {
            Id = Guid.NewGuid(),
            FacultyId = dto.FacultyId,
            Name = dto.Name.Trim(),
            NqfLevel = dto.NqfLevel,
            DurationYears = dto.DurationYears,
            Description = dto.Description,
            MinimumAps = dto.MinimumAps,
            ApplicationLink = dto.ApplicationLink
        };

        _db.Qualifications.Add(qualification);
        await _db.SaveChangesAsync();

        return new QualificationDto
        {
            Id = qualification.Id,
            Name = qualification.Name,
            NqfLevel = qualification.NqfLevel,
            DurationYears = qualification.DurationYears,
            Description = qualification.Description,
            MinimumAps = qualification.MinimumAps,
            ApplicationLink = qualification.ApplicationLink,
            SubjectRequirements = []
        };
    }

    public async Task DeleteQualificationAsync(Guid id)
    {
        var qualification = await _db.Qualifications.FindAsync(id)
            ?? throw new KeyNotFoundException("Qualification not found.");

        qualification.IsActive = false;
        await _db.SaveChangesAsync();
    }

    public async Task AddSubjectRequirementAsync(CreateSubjectRequirementDto dto)
    {
        var requirement = new QualificationSubjectRequirement
        {
            Id = Guid.NewGuid(),
            QualificationId = dto.QualificationId,
            SubjectId = dto.SubjectId,
            MinimumPercentage = dto.MinimumPercentage,
            MinimumLevel = dto.MinimumLevel,
            IsCompulsory = dto.IsCompulsory,
            Notes = dto.Notes
        };

        _db.QualificationSubjectRequirements.Add(requirement);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteSubjectRequirementAsync(Guid id)
    {
        var req = await _db.QualificationSubjectRequirements.FindAsync(id)
            ?? throw new KeyNotFoundException("Requirement not found.");

        _db.QualificationSubjectRequirements.Remove(req);
        await _db.SaveChangesAsync();
    }

    public async Task<BursaryDetailDto> CreateBursaryAsync(CreateBursaryDto dto)
    {
        var bursary = new Bursary
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Provider = dto.Provider.Trim(),
            Description = dto.Description,
            Amount = dto.Amount,
            Coverage = dto.Coverage,
            EligibilityCriteria = dto.EligibilityCriteria,
            RequiredDocuments = dto.RequiredDocuments,
            ApplicationDeadline = dto.ApplicationDeadline,
            FieldOfStudy = dto.FieldOfStudy,
            MinimumGrade = dto.MinimumGrade,
            Location = dto.Location,
            ApplicationLink = dto.ApplicationLink
        };

        _db.Bursaries.Add(bursary);
        await _db.SaveChangesAsync();

        return (await new BursaryService(_db).GetByIdAsync(bursary.Id))!;
    }

    public async Task<BursaryDetailDto> UpdateBursaryAsync(Guid id, UpdateBursaryDto dto)
    {
        var bursary = await _db.Bursaries.FindAsync(id)
            ?? throw new KeyNotFoundException("Bursary not found.");

        bursary.Name = dto.Name.Trim();
        bursary.Provider = dto.Provider.Trim();
        bursary.Description = dto.Description;
        bursary.Amount = dto.Amount;
        bursary.Coverage = dto.Coverage;
        bursary.EligibilityCriteria = dto.EligibilityCriteria;
        bursary.RequiredDocuments = dto.RequiredDocuments;
        bursary.ApplicationDeadline = dto.ApplicationDeadline;
        bursary.FieldOfStudy = dto.FieldOfStudy;
        bursary.MinimumGrade = dto.MinimumGrade;
        bursary.Location = dto.Location;
        bursary.ApplicationLink = dto.ApplicationLink;
        bursary.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();

        return (await new BursaryService(_db).GetByIdAsync(id))!;
    }

    public async Task DeleteBursaryAsync(Guid id)
    {
        var bursary = await _db.Bursaries.FindAsync(id)
            ?? throw new KeyNotFoundException("Bursary not found.");

        bursary.IsActive = false;
        await _db.SaveChangesAsync();
    }

    public async Task<IEnumerable<AdminStudentListItemDto>> GetStudentsAsync(
        string? searchTerm)
    {
        var query = _db.Users
            .Include(u => u.StudentProfile)
                .ThenInclude(sp => sp!.ResultUploads
                    .Where(r => r.IsLatest)
                    .OrderByDescending(r => r.UploadedAt)
                    .Take(1))
            .Where(u => u.Role == Domain.Enums.UserRole.Student)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
            query = query.Where(u =>
                u.FirstName.Contains(searchTerm) ||
                u.LastName.Contains(searchTerm) ||
                u.Email.Contains(searchTerm));

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(u =>
        {
            var latestUpload = u.StudentProfile?.ResultUploads
                .OrderByDescending(r => r.UploadedAt)
                .FirstOrDefault();

            return new AdminStudentListItemDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Province = u.StudentProfile?.Province,
                FieldOfStudyInterest = u.StudentProfile?.FieldOfStudyInterest,
                LatestAverage = latestUpload?.CalculatedAverage,
                LatestAps = latestUpload?.CalculatedAps,
                CreatedAt = u.CreatedAt,
                IsActive = u.IsActive
            };
        });
    }

    public async Task<bool> ToggleStudentActiveAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        user.IsActive = !user.IsActive;
        await _db.SaveChangesAsync();
        return user.IsActive;
    }
}