namespace MiServicio.Application.DTOs;

public record ReminderDto(
    Guid Id,
    string Title,
    TimeOnly Time,
    bool IsCompleted);
