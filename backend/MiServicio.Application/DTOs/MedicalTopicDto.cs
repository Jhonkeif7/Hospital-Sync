namespace MiServicio.Application.DTOs;

public record MedicalTopicDto(
    Guid Id,
    string Title,
    string? Category,
    string? Description,
    DateOnly AssignedDate);
