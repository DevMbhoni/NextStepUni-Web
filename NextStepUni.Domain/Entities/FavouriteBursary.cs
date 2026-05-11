using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class FavouriteBursary
    {
        public Guid UserId { get; set; }
        public Guid BursaryId { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Bursary Bursary { get; set; } = null!;
    }
}
