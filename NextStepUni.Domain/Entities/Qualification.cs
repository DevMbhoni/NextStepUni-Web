using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class Qualification
    {
        public Guid Id { get; set; }
        public Guid FacultyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? NqfLevel { get; set; }
        public int? DurationYears { get; set; }
        public string? Description { get; set; }
        public int? MinimumAps { get; set; }
        public string? ApplicationLink { get; set; }
        public bool IsActive { get; set; } = true;

        public Faculty Faculty { get; set; } = null!;
        public ICollection<QualificationSubjectRequirement> SubjectRequirements { get; set; } = new List<QualificationSubjectRequirement>();
    }
}
