using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class StudentSubjectResult
    {
        public Guid Id { get; set; }
        public Guid ResultUploadId { get; set; }
        public Guid SubjectId { get; set; }
        public decimal Percentage { get; set; }
        public int Level { get; set; }

        public ResultUpload ResultUpload { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
    }
}
