using NextStepUni.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.Interfaces
{
    public interface IBursaryService
    {
        Task<IEnumerable<BursaryListItemDto>> GetAllAsync(
            BursaryFilterDto filter, Guid? userId = null);

        Task<BursaryDetailDto?> GetByIdAsync(Guid id, Guid? userId = null);

        Task<bool> ToggleFavouriteAsync(Guid bursaryId, Guid userId);
    }
}
