using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class Subject
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsCompulsory { get; set; }
        public bool IsLanguage { get; set; }
        public bool IsLifeOrientation { get; set; }

        public ICollection<StudentSubjectResult> StudentSubjectResults { get; set; } = new List<StudentSubjectResult>();
        public ICollection<QualificationSubjectRequirement> QualificationRequirements { get; set; } = new List<QualificationSubjectRequirement>();
    }
}
