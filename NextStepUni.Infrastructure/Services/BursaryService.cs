using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using NextStepUni.Domain.Entities;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.Infrastructure.Services;

public class BursaryService : IBursaryService
{
    private readonly AppDbContext _db;

    public BursaryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<BursaryListItemDto>> GetAllAsync(
        BursaryFilterDto filter, Guid? userId = null)
    {
        var query = _db.Bursaries
            .Where(b => b.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            query = query.Where(b =>
                b.Name.Contains(filter.SearchTerm) ||
                b.Provider.Contains(filter.SearchTerm));

        if (!string.IsNullOrWhiteSpace(filter.FieldOfStudy))
            query = query.Where(b =>
                b.FieldOfStudy == null ||
                b.FieldOfStudy.Contains(filter.FieldOfStudy));

        if (!string.IsNullOrWhiteSpace(filter.Location))
            query = query.Where(b =>
                b.Location == null ||
                b.Location.Contains(filter.Location));

        if (!string.IsNullOrWhiteSpace(filter.Coverage))
            query = query.Where(b => b.Coverage == filter.Coverage);

        if (filter.MinAmount.HasValue)
            query = query.Where(b =>
                b.Amount == null || b.Amount >= filter.MinAmount);

        if (filter.OnlyDeadlineSoon)
            query = query.Where(b =>
                b.ApplicationDeadline.HasValue &&
                b.ApplicationDeadline.Value <= DateTime.UtcNow.AddDays(30) &&
                b.ApplicationDeadline.Value >= DateTime.UtcNow);

        query = query.Where(b =>
            !b.ApplicationDeadline.HasValue ||
            b.ApplicationDeadline.Value >= DateTime.UtcNow);

        var favouriteIds = userId.HasValue
            ? await _db.FavouriteBursaries
                .Where(f => f.UserId == userId.Value)
                .Select(f => f.BursaryId)
                .ToListAsync()
            : new List<Guid>();

        var bursaries = await query
            .OrderBy(b => b.ApplicationDeadline)
            .ToListAsync();

        return bursaries.Select(b => new BursaryListItemDto
        {
            Id = b.Id,
            Name = b.Name,
            Provider = b.Provider,
            Amount = b.Amount,
            Coverage = b.Coverage,
            FieldOfStudy = b.FieldOfStudy,
            Location = b.Location,
            ApplicationDeadline = b.ApplicationDeadline,
            IsFavourited = favouriteIds.Contains(b.Id)
        });
    }

    public async Task<BursaryDetailDto?> GetByIdAsync(Guid id, Guid? userId = null)
    {
        var bursary = await _db.Bursaries
            .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

        if (bursary is null) return null;

        var isFavourited = userId.HasValue && await _db.FavouriteBursaries
            .AnyAsync(f => f.UserId == userId.Value && f.BursaryId == id);

        return new BursaryDetailDto
        {
            Id = bursary.Id,
            Name = bursary.Name,
            Provider = bursary.Provider,
            Description = bursary.Description,
            Amount = bursary.Amount,
            Coverage = bursary.Coverage,
            EligibilityCriteria = bursary.EligibilityCriteria,
            RequiredDocuments = bursary.RequiredDocuments,
            ApplicationDeadline = bursary.ApplicationDeadline,
            FieldOfStudy = bursary.FieldOfStudy,
            MinimumGrade = bursary.MinimumGrade,
            Location = bursary.Location,
            ApplicationLink = bursary.ApplicationLink,
            IsFavourited = isFavourited
        };
    }

    public async Task<bool> ToggleFavouriteAsync(Guid bursaryId, Guid userId)
    {
        var existing = await _db.FavouriteBursaries
            .FirstOrDefaultAsync(f =>
                f.UserId == userId && f.BursaryId == bursaryId);

        if (existing is not null)
        {
            _db.FavouriteBursaries.Remove(existing);
            await _db.SaveChangesAsync();
            return false;
        }

        _db.FavouriteBursaries.Add(new FavouriteBursary
        {
            UserId = userId,
            BursaryId = bursaryId
        });

        await _db.SaveChangesAsync();
        return true;
    }
}