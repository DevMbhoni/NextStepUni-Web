namespace NextStepUni.Application.DTOs;

public class SubjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsCompulsory { get; set; }
    public bool IsLanguage { get; set; }
    public bool IsLifeOrientation { get; set; }
}