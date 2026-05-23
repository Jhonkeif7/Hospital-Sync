namespace MiServicio.Domain.Entities;

public class MedicalTopic : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }
    public DateOnly AssignedDate { get; set; }

    public Guid? ServiceDayId { get; set; }
    public ServiceDay? ServiceDay { get; set; }
}
