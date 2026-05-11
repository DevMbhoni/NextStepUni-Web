using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using NextStepUni.Domain.Entities;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.Infrastructure.Services;

public class UniversityService : IUniversityService
{
    private readonly AppDbContext _db;

    public UniversityService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<UniversityListItemDto>> GetAllAsync(
        UniversityFilterDto filter, Guid? userId = null)
    {
        var query = _db.Universities
            .Where(u => u.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Province))
            query = query.Where(u => u.Province == filter.Province);

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            query = query.Where(u =>
                u.Name.Contains(filter.SearchTerm) ||
                (u.Abbreviation != null && u.Abbreviation.Contains(filter.SearchTerm)) ||
                u.City.Contains(filter.SearchTerm));

        if (filter.MaxFees.HasValue)
            query = query.Where(u =>
                u.AnnualFeesFrom == null || u.AnnualFeesFrom <= filter.MaxFees);

        if (!string.IsNullOrWhiteSpace(filter.FieldOfStudy))
            query = query.Where(u =>
                u.Faculties.Any(f =>
                    f.Qualifications.Any(q =>
                        q.Name.Contains(filter.FieldOfStudy) && q.IsActive)));

        var favouriteIds = userId.HasValue
            ? await _db.FavouriteUniversities
                .Where(f => f.UserId == userId.Value)
                .Select(f => f.UniversityId)
                .ToListAsync()
            : new List<Guid>();

        var universities = await query
            .OrderBy(u => u.Name)
            .ToListAsync();

        return universities.Select(u => new UniversityListItemDto
        {
            Id = u.Id,
            Name = u.Name,
            Abbreviation = u.Abbreviation,
            City = u.City,
            Province = u.Province,
            LogoUrl = u.LogoUrl,
            AnnualFeesFrom = u.AnnualFeesFrom,
            Website = u.Website,
            IsFavourited = favouriteIds.Contains(u.Id)
        });
    }

    public async Task<UniversityDetailDto?> GetByIdAsync(Guid id, Guid? userId = null)
    {
        var university = await _db.Universities
            .Include(u => u.Faculties.Where(f => f.IsActive))
                .ThenInclude(f => f.Qualifications.Where(q => q.IsActive))
                    .ThenInclude(q => q.SubjectRequirements)
                        .ThenInclude(r => r.Subject)
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

        if (university is null) return null;

        var isFavourited = userId.HasValue && await _db.FavouriteUniversities
            .AnyAsync(f => f.UserId == userId.Value && f.UniversityId == id);

        return new UniversityDetailDto
        {
            Id = university.Id,
            Name = university.Name,
            Abbreviation = university.Abbreviation,
            City = university.City,
            Province = university.Province,
            Description = university.Description,
            Website = university.Website,
            ApplicationLink = university.ApplicationLink,
            LogoUrl = university.LogoUrl,
            AnnualFeesFrom = university.AnnualFeesFrom,
            IsFavourited = isFavourited,
            Faculties = university.Faculties.Select(f => new FacultyDto
            {
                Id = f.Id,
                Name = f.Name,
                Description = f.Description,
                Qualifications = f.Qualifications.Select(q => new QualificationDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    NqfLevel = q.NqfLevel,
                    DurationYears = q.DurationYears,
                    Description = q.Description,
                    MinimumAps = q.MinimumAps,
                    ApplicationLink = q.ApplicationLink,
                    SubjectRequirements = q.SubjectRequirements.Select(r =>
                        new SubjectRequirementDto
                        {
                            SubjectName = r.Subject.Name,
                            MinimumPercentage = r.MinimumPercentage,
                            MinimumLevel = r.MinimumLevel,
                            IsCompulsory = r.IsCompulsory,
                            Notes = r.Notes
                        }).ToList()
                }).ToList()
            }).ToList()
        };
    }

    public async Task<bool> ToggleFavouriteAsync(Guid universityId, Guid userId)
    {
        var existing = await _db.FavouriteUniversities
            .FirstOrDefaultAsync(f =>
                f.UserId == userId && f.UniversityId == universityId);

        if (existing is not null)
        {
            _db.FavouriteUniversities.Remove(existing);
            await _db.SaveChangesAsync();
            return false;
        }

        _db.FavouriteUniversities.Add(new FavouriteUniversity
        {
            UserId = userId,
            UniversityId = universityId
        });

        await _db.SaveChangesAsync();
        return true; 
    }
}