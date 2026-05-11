using System;
using System.Collections.Generic;
using NextStepUni.Application.DTOs;


namespace NextStepUni.Application.Interfaces
{
    public interface IChatbotService
    {
        Task<ChatResponseDto> ProcessMessageAsync(string message, Guid? userId = null);
    }
}
