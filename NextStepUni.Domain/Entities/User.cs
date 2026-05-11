using NextStepUni.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public String FirstName { get; set; } = string.Empty;
        public String LastName { get; set; } = string.Empty;
        public String Email { get; set; } = string.Empty;
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpiry { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Student;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public StudentProfile? StudentProfile { get; set; }
        public ICollection<FavouriteBursary> FavouriteBursaries { get; set; } = new List<FavouriteBursary>();
        public ICollection<FavouriteUniversity> FavouriteUniversities { get; set; } = new List<FavouriteUniversity>();
    }
}
