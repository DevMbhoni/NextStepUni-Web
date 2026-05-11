using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.DTOs
{
    public class StudentProfileDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Province { get; set; }
        public string? FieldOfStudyInterest { get; set; }
        public string? SchoolName { get; set; }
        public int? GraduationYear { get; set; }
        public LatestResultsDto? LatestResults { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? Province { get; set; }
        public string? FieldOfStudyInterest { get; set; }
        public string? SchoolName { get; set; }
        public int? GraduationYear { get; set; }
    }

    public class SubjectResultInputDto
    {
        public Guid SubjectId { get; set; }
        public decimal Percentage { get; set; }
    }

    public class UploadResultsDto
    {
        public string UploadType { get; set; } = string.Empty; // Grade11Final | Grade12Mid | Grade12Final
        public List<SubjectResultInputDto> Subjects { get; set; } = new List<SubjectResultInputDto>();
    }

    public class LatestResultsDto
    {
        public Guid UploadId { get; set; }
        public string UploadType { get; set; } = string.Empty;
        public decimal? CalculatedAverage { get; set; }
        public decimal? CalculatedAps { get; set; } 
        public DateTime UploadedAt { get; set; }
        public List<SubjectResultDto> Subjects { get; set; } = new List<SubjectResultDto>();
    }

    public class SubjectResultDto
    {
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
        public int Level { get; set; }
    }

    public class RecommendationDto
    {
        public Guid UniversityId { get; set; }
        public string UniversityName { get; set; } = string.Empty;
        public string? UniversityAbbreviation { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public decimal? AnnualFeesFrom { get; set; }
        public bool IsFavourited { get; set; }

        public Guid QualificationId { get; set; }
        public string QualificationName { get; set; } = string.Empty;
        public string FacultyName { get; set; } = string.Empty;
        public int? MinimumAps { get; set; }
        public int? DurationYears { get; set; }
        public string? ApplicationLink { get; set; }

        public int MatchScore { get; set; }             // 0-100
        public int StudentApsForThisUniversity { get; set; }
        public bool MeetsApsRequirement { get; set; }
        public List<SubjectMatchDto> SubjectMatches { get; set; } = new List<SubjectMatchDto>();
    }

    public class SubjectMatchDto
    {
        public string SubjectName { get; set; } = string.Empty;
        public decimal RequiredPercentage { get; set; }
        public decimal StudentPercentage { get; set; }
        public bool IsMet { get; set; }
        public bool IsCompulsory { get; set; }
    }


}
