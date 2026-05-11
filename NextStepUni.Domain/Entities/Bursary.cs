using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class Bursary
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
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<FavouriteBursary> FavouritedByUsers { get; set; } = new List<FavouriteBursary>();
    }
}
