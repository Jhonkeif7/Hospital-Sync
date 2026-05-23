using MiServicio.Domain.Entities;

namespace MiServicio.Application.Interfaces;

public interface IMedicalTopicRepository
{
    Task<IReadOnlyList<MedicalTopic>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MedicalTopic>> GetByDateAsync(DateOnly date, CancellationToken cancellationToken = default);
}
