using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class University
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Abbreviation { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? ApplicationLink { get; set; }
        public string? LogoUrl { get; set; }
        public decimal? AnnualFeesFrom { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public UniversityApsConfig? ApsConfig { get; set; }
        public ICollection<Faculty> Faculties { get; set; } = new List<Faculty>();
        public ICollection<FavouriteUniversity> FavouritedByUsers { get; set; } = new List<FavouriteUniversity>();
    }
}
