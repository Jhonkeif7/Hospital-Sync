using MiServicio.Domain.Entities;

namespace MiServicio.Application.Interfaces;

public interface IServiceDayRepository
{
    Task<IReadOnlyList<ServiceDay>> GetByDateRangeAsync(DateOnly start, DateOnly end, CancellationToken cancellationToken = default);
    Task<ServiceDay?> GetByDateAsync(DateOnly date, CancellationToken cancellationToken = default);
}
