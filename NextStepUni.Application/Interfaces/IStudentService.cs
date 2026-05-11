using NextStepUni.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.Interfaces
{
    public interface IStudentService
    {
        Task<StudentProfileDto?> GetProfileAsync(Guid userId);
        Task<StudentProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
        Task<LatestResultsDto> UploadResultsAsync(Guid userId, UploadResultsDto dto);
        Task<LatestResultsDto?> GetLatestResultsAsync(Guid userId);
    }
}
