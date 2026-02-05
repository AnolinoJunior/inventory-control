using MaterialControl.Dtos;
using MaterialControl.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaterialControl.Controllers
{
    [ApiController]
    [Route("api/production")]
    public class ProductionController : ControllerBase
    {
        private readonly ProductionService _service;

        public ProductionController(ProductionService service)
        {
            _service = service;
        }

        [HttpGet("suggestion")]
        public async Task<IActionResult> GetSuggestion()
        {
            
            ProductionResultDto result = await _service.CalculateAsync();

            return Ok(result);
        }
    }
}
