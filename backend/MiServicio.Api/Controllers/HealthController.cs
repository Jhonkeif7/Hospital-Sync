using Microsoft.AspNetCore.Mvc;

namespace MiServicio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "API running", service = "Hospital Sync" });
    }
}
