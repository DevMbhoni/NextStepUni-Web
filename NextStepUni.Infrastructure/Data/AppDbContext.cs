using Microsoft.EntityFrameworkCore;
using NextStepUni.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
        public DbSet<Subject> Subjects => Set<Subject>();
        public DbSet<ResultUpload> ResultUploads => Set<ResultUpload>();
        public DbSet<StudentSubjectResult> StudentSubjectResults => Set<StudentSubjectResult>();
        public DbSet<University> Universities => Set<University>();
        public DbSet<UniversityApsConfig> UniversityApsConfigs => Set<UniversityApsConfig>();
        public DbSet<ApsScaleRule> ApsScaleRules => Set<ApsScaleRule>();
        public DbSet<Faculty> Faculties => Set<Faculty>();
        public DbSet<Qualification> Qualifications => Set<Qualification>();
        public DbSet<QualificationSubjectRequirement> QualificationSubjectRequirements => Set<QualificationSubjectRequirement>();
        public DbSet<Bursary> Bursaries => Set<Bursary>();
        public DbSet<FavouriteUniversity> FavouriteUniversities => Set<FavouriteUniversity>();
        public DbSet<FavouriteBursary> FavouriteBursaries => Set<FavouriteBursary>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.Role)
                .HasConversion<string>()
                .HasMaxLength(20);
                e.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
                e.Property(u => u.LastName).HasMaxLength(100).IsRequired();
                e.Property(u => u.Email).HasMaxLength(255).IsRequired();
                e.Property(u => u.PasswordHash).HasMaxLength(500).IsRequired();
                e.Property(u => u.CreatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<StudentProfile>(e =>
            {
                e.HasKey(sp => sp.Id);
                e.Property(sp => sp.Id).HasDefaultValueSql("gen_random_uuid()");
                e.HasIndex(sp => sp.UserId).IsUnique(); 
                e.Property(sp => sp.Province).HasMaxLength(100);
                e.Property(sp => sp.FieldOfStudyInterest).HasMaxLength(200);
                e.Property(sp => sp.SchoolName).HasMaxLength(200);
                e.Property(sp => sp.CreatedAt).HasDefaultValueSql("NOW()");

                e.HasOne(sp => sp.User)
                 .WithOne(u => u.StudentProfile)
                 .HasForeignKey<StudentProfile>(sp => sp.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Subject>(e =>
            {
                e.HasKey(s => s.Id);
                e.Property(s => s.Id).HasDefaultValueSql("gen_random_uuid()");
                e.HasIndex(s => s.Name).IsUnique();
                e.Property(s => s.Name).HasMaxLength(200).IsRequired();
                e.Property(s => s.Category).HasMaxLength(100).IsRequired();
            });

            modelBuilder.Entity<ResultUpload>(e =>
            {
                e.HasKey(r => r.Id);
                e.Property(r => r.Id).HasDefaultValueSql("gen_random_uuid()");
                e.Property(r => r.UploadType)
                 .HasConversion<string>()
                 .HasMaxLength(20);
                e.Property(r => r.CalculatedAverage).HasPrecision(5, 2);
                e.Property(r => r.CalculatedAps).HasPrecision(5, 2);
                e.Property(r => r.UploadedAt).HasDefaultValueSql("NOW()");

                e.HasOne(r => r.StudentProfile)
                 .WithMany(sp => sp.ResultUploads)
                 .HasForeignKey(r => r.StudentProfileId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<StudentSubjectResult>(e =>
            {
                e.HasKey(r => r.Id);
                e.Property(r => r.Id).HasDefaultValueSql("gen_random_uuid()");
                e.Property(r => r.Percentage).HasPrecision(5, 2);

           
                e.HasIndex(r => new { r.ResultUploadId, r.SubjectId }).IsUnique();

                e.HasOne(r => r.ResultUpload)
                 .WithMany(u => u.SubjectResults)
                 .HasForeignKey(r => r.ResultUploadId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(r => r.Subject)
                 .WithMany(s => s.StudentSubjectResults)
                 .HasForeignKey(r => r.SubjectId)
                 .OnDelete(DeleteBehavior.Restrict); 
            });

            modelBuilder.Entity<University>(e =>
            {
                e.HasKey(u => u.Id);
                e.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
                e.HasIndex(u => u.Name).IsUnique();
                e.Property(u => u.Name).HasMaxLength(300).IsRequired();
                e.Property(u => u.Abbreviation).HasMaxLength(20);
                e.Property(u => u.City).HasMaxLength(100).IsRequired();
                e.Property(u => u.Province).HasMaxLength(100).IsRequired();
                e.Property(u => u.AnnualFeesFrom).HasPrecision(10, 2);
                e.Property(u => u.CreatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<UniversityApsConfig>(e =>
            {
                e.HasKey(c => c.Id);
                e.Property(c => c.Id).HasDefaultValueSql("gen_random_uuid()");
                e.HasIndex(c => c.UniversityId).IsUnique(); // one config per university
                e.Property(c => c.Notes).HasMaxLength(500);

                e.HasOne(c => c.University)
                 .WithOne(u => u.ApsConfig)
                 .HasForeignKey<UniversityApsConfig>(c => c.UniversityId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApsScaleRule>(e =>
            {
                e.HasKey(r => r.Id);
                e.Property(r => r.Id).HasDefaultValueSql("gen_random_uuid()");

                e.HasOne(r => r.ApsConfig)
                 .WithMany(c => c.ScaleRules)
                 .HasForeignKey(r => r.UniversityApsConfigId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Faculty>(e =>
            {
                e.HasKey(f => f.Id);
                e.Property(f => f.Id).HasDefaultValueSql("gen_random_uuid()");
                e.Property(f => f.Name).HasMaxLength(200).IsRequired();

                e.HasOne(f => f.University)
                 .WithMany(u => u.Faculties)
                 .HasForeignKey(f => f.UniversityId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Qualification>(e =>
            {
                e.HasKey(q => q.Id);
                e.Property(q => q.Id).HasDefaultValueSql("gen_random_uuid()");
                e.Property(q => q.Name).HasMaxLength(300).IsRequired();
                e.Property(q => q.ApplicationLink).HasMaxLength(500);

                e.HasOne(q => q.Faculty)
                 .WithMany(f => f.Qualifications)
                 .HasForeignKey(q => q.FacultyId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<QualificationSubjectRequirement>(e =>
            {
                e.HasKey(r => r.Id);
                e.Property(r => r.Id).HasDefaultValueSql("gen_random_uuid()");
                e.Property(r => r.MinimumPercentage).HasPrecision(5, 2);
                e.Property(r => r.Notes).HasMaxLength(300);

                e.HasIndex(r => new { r.QualificationId, r.SubjectId }).IsUnique();

                e.HasOne(r => r.Qualification)
                 .WithMany(q => q.SubjectRequirements)
                 .HasForeignKey(r => r.QualificationId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(r => r.Subject)
                 .WithMany(s => s.QualificationRequirements)
                 .HasForeignKey(r => r.SubjectId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Bursary>(e =>
            {
                e.HasKey(b => b.Id);
                e.Property(b => b.Id).HasDefaultValueSql("gen_random_uuid()");
                e.Property(b => b.Name).HasMaxLength(300).IsRequired();
                e.Property(b => b.Provider).HasMaxLength(200).IsRequired();
                e.Property(b => b.Amount).HasPrecision(10, 2);
                e.Property(b => b.MinimumGrade).HasPrecision(5, 2);
                e.Property(b => b.Coverage).HasMaxLength(100);
                e.Property(b => b.FieldOfStudy).HasMaxLength(300);
                e.Property(b => b.Location).HasMaxLength(200);
                e.Property(b => b.ApplicationLink).HasMaxLength(500);
                e.Property(b => b.CreatedAt).HasDefaultValueSql("NOW()");
            });

            modelBuilder.Entity<FavouriteUniversity>(e =>
            {
                e.HasKey(f => new { f.UserId, f.UniversityId });
                e.Property(f => f.SavedAt).HasDefaultValueSql("NOW()");

                e.HasOne(f => f.User)
                 .WithMany(u => u.FavouriteUniversities)
                 .HasForeignKey(f => f.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(f => f.University)
                 .WithMany(u => u.FavouritedByUsers)
                 .HasForeignKey(f => f.UniversityId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<FavouriteBursary>(e =>
            {
                e.HasKey(f => new { f.UserId, f.BursaryId });
                e.Property(f => f.SavedAt).HasDefaultValueSql("NOW()");

                e.HasOne(f => f.User)
                 .WithMany(u => u.FavouriteBursaries)
                 .HasForeignKey(f => f.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(f => f.Bursary)
                 .WithMany(b => b.FavouritedByUsers)
                 .HasForeignKey(f => f.BursaryId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
