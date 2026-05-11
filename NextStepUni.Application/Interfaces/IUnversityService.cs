using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NextStepUni.Application.DTOs;

namespace NextStepUni.Application.Interfaces
{

    public interface IUniversityService
    {
        Task<IEnumerable<UniversityListItemDto>> GetAllAsync(
            UniversityFilterDto filter, Guid? userId = null);

        Task<UniversityDetailDto?> GetByIdAsync(Guid id, Guid? userId = null);

        Task<bool> ToggleFavouriteAsync(Guid universityId, Guid userId);
    }
}
