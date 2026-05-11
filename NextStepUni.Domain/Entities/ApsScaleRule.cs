using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class ApsScaleRule
    {
        public Guid Id { get; set; }
        public Guid UniversityApsConfigId { get; set; }
        public int MinPercentage { get; set; }
        public int MaxPercentage { get; set; }
        public int ApsPoints { get; set; }

        public UniversityApsConfig ApsConfig { get; set; } = null!;
    }
}
