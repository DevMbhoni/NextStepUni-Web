using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class StudentProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Province {  get; set; }
        public string? FieldOfStudyInterest { get; set; }
        public string? SchoolName { get; set; }
        public int? GraduationYear { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public ICollection<ResultUpload> ResultUploads { get; set; } = new List<ResultUpload>();
    }
}
