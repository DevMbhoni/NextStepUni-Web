using Microsoft.EntityFrameworkCore;
using NextStepUni.Application.DTOs;
using NextStepUni.Application.Interfaces;
using NextStepUni.Infrastructure.Data;

namespace NextStepUni.Infrastructure.Services;

public class ChatbotService : IChatbotService
{
    private readonly AppDbContext _db;


    private static readonly string[] GreetingWords =
        ["hi", "hello", "hey", "howzit", "good morning", "good afternoon", "sup"];

    private static readonly string[] BursaryWords =
        ["bursary", "bursaries", "scholarship", "funding", "financial aid",
         "nsfas", "sponsor", "stipend", "grant", "money for studies", "fees help"];

    private static readonly string[] UniversityWords =
        ["university", "universities", "campus", "institution", "college",
         "uct", "wits", "up ", "ul ", "univen", "varsity", "where to study"];

    private static readonly string[] DeadlineWords =
        ["deadline", "closing date", "when", "expire", "last day",
         "due date", "closes", "closing soon", "still open"];

    private static readonly string[] EligibilityWords =
        ["eligible", "qualify", "requirements", "criteria",
         "who can apply", "can i apply", "do i qualify"];

    private static readonly string[] RecommendationWords =
        ["recommend", "suggest", "match", "suits me", "for me",
         "what should i", "which university", "which bursary"];

    private static readonly string[] ProvinceWords =
        ["limpopo", "gauteng", "western cape", "eastern cape", "kwazulu-natal",
         "kzn", "mpumalanga", "north west", "free state", "northern cape"];

    private static readonly string[] FieldWords =
        ["computer science", "engineering", "medicine", "law",
         "accounting", "it", "information technology", "education",
         "science", "commerce", "arts", "nursing"];

    public ChatbotService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ChatResponseDto> ProcessMessageAsync(
        string message, Guid? userId = null)
    {
        var normalised = message.ToLower().Trim();

        var intent = DetectIntent(normalised);

        return intent switch
        {
            "greeting" => HandleGreeting(),
            "bursary_deadline" => await HandleBursaryDeadlinesAsync(),
            "bursary_eligibility" => await HandleBursaryEligibilityAsync(normalised),
            "bursary_general" => await HandleBursaryGeneralAsync(normalised),
            "university_province" => await HandleUniversityByProvinceAsync(normalised),
            "university_general" => await HandleUniversityGeneralAsync(normalised),
            "recommendation" => HandleRecommendation(userId),
            _ => HandleUnknown()
        };
    }

    private static string DetectIntent(string message)
    {
        bool hasBursary = BursaryWords.Any(k => message.Contains(k));
        bool hasUniversity = UniversityWords.Any(k => message.Contains(k));
        bool hasDeadline = DeadlineWords.Any(k => message.Contains(k));
        bool hasEligibility = EligibilityWords.Any(k => message.Contains(k));
        bool hasRecommend = RecommendationWords.Any(k => message.Contains(k));
        bool hasProvince = ProvinceWords.Any(k => message.Contains(k));
        bool hasGreeting = GreetingWords.Any(k => message.Contains(k));

        if (hasGreeting && !hasBursary && !hasUniversity)
            return "greeting";

        if (hasRecommend)
            return "recommendation";

        if (hasBursary && hasDeadline)
            return "bursary_deadline";

        if (hasBursary && hasEligibility)
            return "bursary_eligibility";

        if (hasBursary)
            return "bursary_general";

        if (hasUniversity && hasProvince)
            return "university_province";

        if (hasUniversity)
            return "university_general";

        return "unknown";
    }


    private static ChatResponseDto HandleGreeting() => new()
    {
        Intent = "greeting",
        Message = "Hi there! I can help you find bursaries and universities. " +
                  "Try asking me:\n" +
                  "• \"What bursaries are available for Computer Science?\"\n" +
                  "• \"Which bursaries close soon?\"\n" +
                  "• \"Show me universities in Limpopo\"\n" +
                  "• \"Recommend universities for me\""
    };

    private async Task<ChatResponseDto> HandleBursaryDeadlinesAsync()
    {
        var upcoming = await _db.Bursaries
            .Where(b =>
                b.IsActive &&
                b.ApplicationDeadline.HasValue &&
                b.ApplicationDeadline >= DateTime.UtcNow &&
                b.ApplicationDeadline <= DateTime.UtcNow.AddDays(60))
            .OrderBy(b => b.ApplicationDeadline)
            .Take(5)
            .ToListAsync();

        if (!upcoming.Any())
            return new ChatResponseDto
            {
                Intent = "bursary_deadline",
                Message = "There are no bursaries closing in the next 60 days."
            };

        var lines = upcoming.Select(b =>
            $"• {b.Name} ({b.Provider}) — closes " +
            $"{b.ApplicationDeadline!.Value:dd MMM yyyy}");

        return new ChatResponseDto
        {
            Intent = "bursary_deadline",
            Message = "Bursaries closing in the next 60 days:\n" +
                      string.Join("\n", lines),
            Results = upcoming.Select(b => new ChatResultItemDto
            {
                Id = b.Id,
                Type = "bursary",
                Name = b.Name,
                SubTitle = $"Closes {b.ApplicationDeadline!.Value:dd MMM yyyy}",
                Link = b.ApplicationLink
            }).ToList()
        };
    }

    private async Task<ChatResponseDto> HandleBursaryEligibilityAsync(string message)
    {
        var matchedField = FieldWords.FirstOrDefault(f => message.Contains(f));

        var query = _db.Bursaries
            .Where(b => b.IsActive &&
                       (!b.ApplicationDeadline.HasValue ||
                         b.ApplicationDeadline >= DateTime.UtcNow));

        if (matchedField is not null)
            query = query.Where(b =>
                b.FieldOfStudy == null ||
                b.FieldOfStudy.ToLower().Contains(matchedField));

        var bursaries = await query.Take(5).ToListAsync();

        if (!bursaries.Any())
            return new ChatResponseDto
            {
                Intent = "bursary_eligibility",
                Message = "I couldn't find bursaries matching that field. " +
                          "Try browsing all bursaries on the Bursaries page."
            };

        var fieldText = matchedField is not null ? $" for {matchedField}" : "";
        var lines = bursaries.Select(b =>
            $"• {b.Name} — min average {b.MinimumGrade ?? 0}%," +
            $" covers {b.Coverage ?? "varies"}");

        return new ChatResponseDto
        {
            Intent = "bursary_eligibility",
            Message = $"Here are bursaries you may qualify for{fieldText}:\n" +
                      string.Join("\n", lines),
            Results = bursaries.Select(b => new ChatResultItemDto
            {
                Id = b.Id,
                Type = "bursary",
                Name = b.Name,
                SubTitle = $"Min {b.MinimumGrade ?? 0}% • {b.Coverage ?? "varies"}",
                Link = b.ApplicationLink
            }).ToList()
        };
    }

    private async Task<ChatResponseDto> HandleBursaryGeneralAsync(string message)
    {
        var matchedField = FieldWords.FirstOrDefault(f => message.Contains(f));

        var query = _db.Bursaries
            .Where(b => b.IsActive &&
                       (!b.ApplicationDeadline.HasValue ||
                         b.ApplicationDeadline >= DateTime.UtcNow));

        if (matchedField is not null)
            query = query.Where(b =>
                b.FieldOfStudy == null ||
                b.FieldOfStudy.ToLower().Contains(matchedField));

        var bursaries = await query
            .OrderBy(b => b.ApplicationDeadline)
            .Take(5)
            .ToListAsync();

        if (!bursaries.Any())
            return new ChatResponseDto
            {
                Intent = "bursary_general",
                Message = "I couldn't find any active bursaries right now. " +
                          "Check back soon or visit the Bursaries page."
            };

        var lines = bursaries.Select(b =>
            $"• {b.Name} by {b.Provider} — " +
            $"R{b.Amount:N0}, covers {b.Coverage ?? "varies"}");

        return new ChatResponseDto
        {
            Intent = "bursary_general",
            Message = $"Here are some available bursaries" +
                      $"{(matchedField is not null ? $" for {matchedField}" : "")}:\n" +
                      string.Join("\n", lines) +
                      "\n\nVisit the Bursaries page to filter by field, province, or amount.",
            Results = bursaries.Select(b => new ChatResultItemDto
            {
                Id = b.Id,
                Type = "bursary",
                Name = b.Name,
                SubTitle = $"R{b.Amount:N0} • {b.Coverage ?? "varies"}",
                Link = b.ApplicationLink
            }).ToList()
        };
    }

    private async Task<ChatResponseDto> HandleUniversityByProvinceAsync(string message)
    {
        var matchedProvince = ProvinceWords.FirstOrDefault(p => message.Contains(p));

        var universities = await _db.Universities
            .Where(u => u.IsActive &&
                        u.Province.ToLower().Contains(matchedProvince!))
            .OrderBy(u => u.Name)
            .Take(5)
            .ToListAsync();

        if (!universities.Any())
            return new ChatResponseDto
            {
                Intent = "university_province",
                Message = $"I couldn't find universities in {matchedProvince}. " +
                          "Try the Universities page to browse all provinces."
            };

        var lines = universities.Select(u =>
            $"• {u.Name} ({u.Abbreviation}) — {u.City}, " +
            $"fees from R{u.AnnualFeesFrom:N0}/year");

        return new ChatResponseDto
        {
            Intent = "university_province",
            Message = $"Universities in {matchedProvince}:\n" +
                      string.Join("\n", lines),
            Results = universities.Select(u => new ChatResultItemDto
            {
                Id = u.Id,
                Type = "university",
                Name = u.Name,
                SubTitle = $"{u.City} • R{u.AnnualFeesFrom:N0}/yr",
                Link = u.Website
            }).ToList()
        };
    }

    private async Task<ChatResponseDto> HandleUniversityGeneralAsync(string message)
    {
        var universities = await _db.Universities
            .Where(u => u.IsActive)
            .OrderBy(u => u.Name)
            .Take(5)
            .ToListAsync();

        var lines = universities.Select(u =>
            $"• {u.Name} ({u.Abbreviation}) — {u.City}, {u.Province}");

        return new ChatResponseDto
        {
            Intent = "university_general",
            Message = "Here are some universities in the system:\n" +
                      string.Join("\n", lines) +
                      "\n\nVisit the Universities page to filter by province and fees.",
            Results = universities.Select(u => new ChatResultItemDto
            {
                Id = u.Id,
                Type = "university",
                Name = u.Name,
                SubTitle = $"{u.City}, {u.Province}",
                Link = u.Website
            }).ToList()
        };
    }


    private static ChatResponseDto HandleRecommendation(Guid? userId) =>
        userId.HasValue
            ? new ChatResponseDto
            {
                Intent = "recommendation",
                Message = "To get personalised recommendations, make sure you have " +
                          "uploaded your subject results under My Profile. " +
                          "Then visit the Recommendations page for your matches."
            }
            : new ChatResponseDto
            {
                Intent = "recommendation",
                Message = "You need to be logged in to get personalised recommendations. " +
                          "Register or log in, upload your results, " +
                          "and I will match you with the right universities and bursaries."
            };

    private static ChatResponseDto HandleUnknown() => new()
    {
        Intent = "unknown",
        Message = "I am not sure how to help with that. You can ask me about:\n" +
                  "• Available bursaries and scholarships\n" +
                  "• Bursary deadlines\n" +
                  "• Eligibility requirements\n" +
                  "• Universities by province\n" +
                  "• Recommendations (when logged in)"
    };
}