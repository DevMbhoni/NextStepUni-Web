using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextStepUni.Application.DTOs
{
    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
    }

    public class ChatResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public string Intent { get; set; } = string.Empty;
        public List<ChatResultItemDto> Results { get; set; } = new List<ChatResultItemDto>();
    }

    public class ChatResultItemDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? SubTitle { get; set; }
        public string? Link { get; set; }
    }
}
