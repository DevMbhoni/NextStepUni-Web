using NextStepUni.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.Interfaces
{
    public interface IAdminService
    {
        // Overview
        Task<AdminOverviewDto> GetOverviewAsync();

        // Universities
        Task<UniversityDetailDto> CreateUniversityAsync(CreateUniversityDto dto);
        Task<UniversityDetailDto> UpdateUniversityAsync(Guid id, UpdateUniversityDto dto);
        Task DeleteUniversityAsync(Guid id);

        // Faculties
        Task<FacultyDto> CreateFacultyAsync(CreateFacultyDto dto);
        Task DeleteFacultyAsync(Guid id);

        // Qualifications
        Task<QualificationDto> CreateQualificationAsync(CreateQualificationDto dto);
        Task DeleteQualificationAsync(Guid id);

        // Subject requirements
        Task AddSubjectRequirementAsync(CreateSubjectRequirementDto dto);
        Task DeleteSubjectRequirementAsync(Guid id);

        // Bursaries
        Task<BursaryDetailDto> CreateBursaryAsync(CreateBursaryDto dto);
        Task<BursaryDetailDto> UpdateBursaryAsync(Guid id, UpdateBursaryDto dto);
        Task DeleteBursaryAsync(Guid id);

        // Students
        Task<IEnumerable<AdminStudentListItemDto>> GetStudentsAsync(string? searchTerm);
        Task<bool> ToggleStudentActiveAsync(Guid userId);
    }
}
