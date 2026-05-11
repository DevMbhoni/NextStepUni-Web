using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class FavouriteUniversity
    {
        public Guid UserId { get; set; }
        public Guid UniversityId { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

       
        public User User { get; set; } = null!;
        public University University { get; set; } = null!;
    }
}
