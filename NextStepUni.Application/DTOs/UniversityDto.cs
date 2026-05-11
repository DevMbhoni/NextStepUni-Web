using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.DTOs
{
    public class UniversityListItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Abbreviation { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public decimal? AnnualFeesFrom { get; set; }
        public string? Website { get; set; }
        public bool IsFavourited { get; set; }
    }

    public class UniversityDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Abbreviation { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? ApplicationLink { get; set; }
        public string? LogoUrl { get; set; }
        public decimal? AnnualFeesFrom { get; set; }
        public bool IsFavourited { get; set; }
        public List<FacultyDto> Faculties { get; set; } = [];
    }

    public class FacultyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<QualificationDto> Qualifications { get; set; } = [];
    }

    public class QualificationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? NqfLevel { get; set; }
        public int? DurationYears { get; set; }
        public string? Description { get; set; }
        public int? MinimumAps { get; set; }
        public string? ApplicationLink { get; set; }
        public List<SubjectRequirementDto> SubjectRequirements { get; set; } = [];
    }

    public class SubjectRequirementDto
    {
        public string SubjectName { get; set; } = string.Empty;
        public decimal? MinimumPercentage { get; set; }
        public int? MinimumLevel { get; set; }
        public bool IsCompulsory { get; set; }
        public string? Notes { get; set; }
    }

    public class UniversityFilterDto
    {
        public string? Province { get; set; }
        public string? SearchTerm { get; set; }
        public decimal? MaxFees { get; set; }
        public int? MaxAps { get; set; }
        public string? FieldOfStudy { get; set; }
    }
}
