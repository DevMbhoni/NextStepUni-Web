using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.DTOs
{
    public class BursaryListItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public string? Coverage { get; set; }
        public string? FieldOfStudy { get; set; }
        public string? Location { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public int? DaysUntilDeadline => ApplicationDeadline.HasValue
            ? (int)(ApplicationDeadline.Value - DateTime.UtcNow).TotalDays
            : null;
        public bool IsDeadlineSoon => DaysUntilDeadline.HasValue && DaysUntilDeadline <= 30;
        public bool IsFavourited { get; set; }
    }

    public class BursaryDetailDto
    {
        public Guid Id { get; set; }
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
        public int? DaysUntilDeadline => ApplicationDeadline.HasValue
            ? (int)(ApplicationDeadline.Value - DateTime.UtcNow).TotalDays
            : null;
        public bool IsDeadlineSoon => DaysUntilDeadline.HasValue && DaysUntilDeadline <= 30;
        public bool IsFavourited { get; set; }
    }

    public class BursaryFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? FieldOfStudy { get; set; }
        public string? Location { get; set; }
        public string? Coverage { get; set; }
        public decimal? MinAmount { get; set; }
        public bool OnlyDeadlineSoon { get; set; } = false;
    }
}
