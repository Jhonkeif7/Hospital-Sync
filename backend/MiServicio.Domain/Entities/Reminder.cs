namespace MiServicio.Domain.Entities;

public class Reminder : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public TimeOnly Time { get; set; }
    public bool IsCompleted { get; set; }

    public Guid ServiceDayId { get; set; }
    public ServiceDay ServiceDay { get; set; } = null!;
}
