using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class Faculty
    {
        public Guid Id { get; set; }
        public Guid UniversityId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        public University University { get; set; } = null!;
        public ICollection<Qualification> Qualifications { get; set; } = new List<Qualification>();
    }
}
