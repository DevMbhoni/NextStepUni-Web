using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.DTOs
{
    public class CreateUniversityDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Abbreviation { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? ApplicationLink { get; set; }
        public string? LogoUrl { get; set; }
        public decimal? AnnualFeesFrom { get; set; }

        public bool ApsIncludesLifeOrientation { get; set; } = true;
        public int ApsSubjectsCounted { get; set; } = 6;
        public string? ApsNotes { get; set; }
    }

    public class UpdateUniversityDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Abbreviation { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? ApplicationLink { get; set; }
        public string? LogoUrl { get; set; }
        public decimal? AnnualFeesFrom { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class CreateFacultyDto
    {
        public Guid UniversityId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateQualificationDto
    {
        public Guid FacultyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? NqfLevel { get; set; }
        public int? DurationYears { get; set; }
        public string? Description { get; set; }
        public int? MinimumAps { get; set; }
        public string? ApplicationLink { get; set; }
    }

    public class CreateSubjectRequirementDto
    {
        public Guid QualificationId { get; set; }
        public Guid SubjectId { get; set; }
        public decimal? MinimumPercentage { get; set; }
        public int? MinimumLevel { get; set; }
        public bool IsCompulsory { get; set; } = true;
        public string? Notes { get; set; }
    }

    public class CreateBursaryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? Amount { get; set; }
        public string? Coverage { get; set; }
        public string? EligibilityCriteria { get; set; }
        public string? RequiredDocuments { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public string? FieldOfStudy { get; set; }
        public decimal? MinimumGrade { get; set; }
        public string? Location { get; set; }
        public string? ApplicationLink { get; set; }
    }

    public class UpdateBursaryDto : CreateBursaryDto
    {
        public bool IsActive { get; set; } = true;
    }

    public class AdminStudentListItemDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Province { get; set; }
        public string? FieldOfStudyInterest { get; set; }
        public decimal? LatestAverage { get; set; }
        public decimal? LatestAps { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class AdminOverviewDto
    {
        public int TotalUniversities { get; set; }
        public int TotalBursaries { get; set; }
        public int ActiveBursaries { get; set; }
        public int TotalStudents { get; set; }
        public int BursariesClosingSoon { get; set; }  // within 30 days
        public int NewStudentsThisWeek { get; set; }
    }

}
