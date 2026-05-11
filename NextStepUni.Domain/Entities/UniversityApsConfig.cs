using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class UniversityApsConfig
    {
        public Guid Id { get; set; }
        public Guid UniversityId { get; set; }
        public bool IncludesLifeOrientation { get; set; } = true;
        public int SubjectsCountedInAps { get; set; } = 6;
        public string? Notes { get; set; }

        public University University { get; set; } = null!;
        public ICollection<ApsScaleRule> ScaleRules { get; set; } = new List<ApsScaleRule>();
    }
}
