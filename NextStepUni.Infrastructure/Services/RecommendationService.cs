using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using NextStepUni.Domain.Entities;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.Infrastructure.Services;

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _db;

    public RecommendationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<RecommendationDto>> GetRecommendationsAsync(Guid userId)
    {
        var profile = await _db.StudentProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new Exception("Student profile not found.");

        var upload = await _db.ResultUploads
            .Include(r => r.SubjectResults)
                .ThenInclude(sr => sr.Subject)
            .Where(r => r.StudentProfileId == profile.Id && r.IsLatest)
            .OrderByDescending(r => r.UploadedAt)
            .FirstOrDefaultAsync();

        if (upload is null) return [];

        var universities = await _db.Universities
            .Include(u => u.ApsConfig)
                .ThenInclude(c => c!.ScaleRules)
            .Include(u => u.Faculties.Where(f => f.IsActive))
                .ThenInclude(f => f.Qualifications.Where(q => q.IsActive))
                    .ThenInclude(q => q.SubjectRequirements)
                        .ThenInclude(r => r.Subject)
            .Where(u => u.IsActive)
            .ToListAsync();

        var favouriteIds = await _db.FavouriteUniversities
            .Where(f => f.UserId == userId)
            .Select(f => f.UniversityId)
            .ToListAsync();

        var studentResults = upload.SubjectResults.ToList();
        var recommendations = new List<RecommendationDto>();

        foreach (var university in universities)
        {
            // Calculate this student's APS using THIS university's own scale
            var studentAps = CalculateApsForUniversity(studentResults, university.ApsConfig);

            foreach (var faculty in university.Faculties)
            {
                foreach (var qualification in faculty.Qualifications)
                {
                    var (score, subjectMatches) = ScoreQualification(
                        qualification, studentResults, studentAps);

                    // Only include if student meets at least APS or
                    // has some subject matches — not completely unqualified
                    if (score <= 0) continue;

                    recommendations.Add(new RecommendationDto
                    {
                        UniversityId = university.Id,
                        UniversityName = university.Name,
                        UniversityAbbreviation = university.Abbreviation,
                        City = university.City,
                        Province = university.Province,
                        LogoUrl = university.LogoUrl,
                        AnnualFeesFrom = university.AnnualFeesFrom,
                        IsFavourited = favouriteIds.Contains(university.Id),
                        QualificationId = qualification.Id,
                        QualificationName = qualification.Name,
                        FacultyName = faculty.Name,
                        MinimumAps = qualification.MinimumAps,
                        DurationYears = qualification.DurationYears,
                        ApplicationLink = qualification.ApplicationLink
                                                 ?? university.ApplicationLink,
                        MatchScore = score,
                        StudentApsForThisUniversity = studentAps,
                        MeetsApsRequirement = qualification.MinimumAps is null ||
                                                      studentAps >= qualification.MinimumAps,
                        SubjectMatches = subjectMatches
                    });
                }
            }
        }

        // Best matches first
        return recommendations.OrderByDescending(r => r.MatchScore);
    }

    private static int CalculateApsForUniversity(
        List<StudentSubjectResult> results,
        Domain.Entities.UniversityApsConfig? config)
    {
        if (config is null) return 0;

        var eligibleResults = config.IncludesLifeOrientation
            ? results
            : results.Where(r => !r.Subject.IsLifeOrientation).ToList();

        var topResults = eligibleResults
            .OrderByDescending(r => r.Percentage)
            .Take(config.SubjectsCountedInAps)
            .ToList();

        int totalAps = 0;

        foreach (var result in topResults)
        {
            var rule = config.ScaleRules
                .FirstOrDefault(r =>
                    result.Percentage >= r.MinPercentage &&
                    result.Percentage <= r.MaxPercentage);

            totalAps += rule?.ApsPoints ?? 0;
        }

        return totalAps;
    }

    private static (int score, List<SubjectMatchDto> matches) ScoreQualification(
        Domain.Entities.Qualification qualification,
        List<StudentSubjectResult> studentResults,
        int studentAps)
    {
        var subjectMatches = new List<SubjectMatchDto>();
        int score = 0;
        bool failedCompulsory = false;

        if (qualification.MinimumAps.HasValue)
        {
            if (studentAps >= qualification.MinimumAps.Value)
                score += 40;
            else
                score -= 10; 
        }
        else
        {
            score += 20; 
        }

        var requirements = qualification.SubjectRequirements.ToList();

        if (!requirements.Any())
        {
            score += 30; 
        }
        else
        {
            int pointsPerSubject = 60 / requirements.Count;

            foreach (var req in requirements)
            {
                var studentResult = studentResults
                    .FirstOrDefault(r => r.SubjectId == req.SubjectId);

                if (studentResult is null)
                {
                    if (req.IsCompulsory)
                    {
                        failedCompulsory = true;
                        subjectMatches.Add(new SubjectMatchDto
                        {
                            SubjectName = req.Subject.Name,
                            RequiredPercentage = req.MinimumPercentage ?? 0,
                            StudentPercentage = 0,
                            IsMet = false,
                            IsCompulsory = true
                        });
                    }
                    continue;
                }

                bool met = !req.MinimumPercentage.HasValue ||
                           studentResult.Percentage >= req.MinimumPercentage.Value;

                if (met)
                    score += pointsPerSubject;
                else if (req.IsCompulsory)
                    failedCompulsory = true;

                subjectMatches.Add(new SubjectMatchDto
                {
                    SubjectName = req.Subject.Name,
                    RequiredPercentage = req.MinimumPercentage ?? 0,
                    StudentPercentage = studentResult.Percentage,
                    IsMet = met,
                    IsCompulsory = req.IsCompulsory
                });
            }
        }

        if (failedCompulsory) return (0, subjectMatches);

        return (Math.Clamp(score, 0, 100), subjectMatches);
    }
}