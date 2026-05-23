namespace MiServicio.Domain.Entities;

public class ServiceDay : BaseEntity
{
    public DateOnly Date { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<MedicalTopic> Topics { get; set; } = [];
    public ICollection<Reminder> Reminders { get; set; } = [];
}
