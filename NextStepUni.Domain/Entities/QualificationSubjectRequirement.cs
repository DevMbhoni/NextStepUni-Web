using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class QualificationSubjectRequirement
    {
        public Guid Id { get; set; }
        public Guid QualificationId { get; set; }
        public Guid SubjectId { get; set; }
        public decimal? MinimumPercentage { get; set; }
        public int? MinimumLevel { get; set; }
        public bool IsCompulsory { get; set; } = true;
        public string? Notes { get; set; }

        public Qualification Qualification { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
    }
}
