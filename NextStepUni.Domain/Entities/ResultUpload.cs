using NextStepUni.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class ResultUpload
    {
        public Guid Id { get; set; }
        public Guid StudentProfileId { get; set; }
        public UploadType UploadType { get; set; }
        public decimal? CalculatedAverage { get; set; }
        public decimal? CalculatedAps { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public bool IsLatest { get; set; } = true;

        public StudentProfile StudentProfile { get; set; } = null!;
        public ICollection<StudentSubjectResult> SubjectResults { get; set; } = new List<StudentSubjectResult>();

    }
}
