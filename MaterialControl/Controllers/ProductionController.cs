using MaterialControl.Dtos;
using MaterialControl.DTOs;
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

        [HttpPost("execute/{productId}")]
        public async Task<IActionResult> ExecuteProduction(int productId, [FromBody] ProductionExecutionDto dto)
        {
            if (dto.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var result = await _service.ExecuteProductionAsync(productId, dto.Quantity);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}