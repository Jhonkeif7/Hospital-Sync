namespace MiServicio.Application.DTOs;

public record ServiceDayDto(
    Guid Id,
    DateOnly Date,
    string? Notes,
    bool IsActive,
    IReadOnlyList<MedicalTopicDto> Topics,
    IReadOnlyList<ReminderDto> Reminders);
