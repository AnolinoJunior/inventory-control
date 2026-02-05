using MaterialControl.Data;
using MaterialControl.Dtos;
using MaterialControl.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MaterialControl.Controllers
{
    [ApiController]
    [Route("api/rawmaterials")]
    public class RawMaterialController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RawMaterialController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var materials = await _context.RawMaterials
                .AsNoTracking()
                .Select(r => new
                {
                    r.Id,
                    r.Code,
                    r.Name,
                    r.StockQuantity
                })
                .ToListAsync();

            return Ok(materials);
        }

      
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var material = await _context.RawMaterials
                .AsNoTracking()
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    r.Id,
                    r.Code,
                    r.Name,
                    r.StockQuantity
                })
                .FirstOrDefaultAsync();

            if (material == null)
                return NotFound();

            return Ok(material);
        }

   
        [HttpPost]
        public async Task<IActionResult> Post(RawMaterialCreateDto dto)
        {
            var material = new RawMaterial
            {
                Code = dto.Code,
                Name = dto.Name,
                StockQuantity = dto.StockQuantity
            };

            _context.RawMaterials.Add(material);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = material.Id }, material);
        }

    
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, RawMaterialUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var material = await _context.RawMaterials.FindAsync(id);
            if (material == null)
                return NotFound();

            material.Code = dto.Code;
            material.Name = dto.Name;
            material.StockQuantity = dto.StockQuantity;

            await _context.SaveChangesAsync();
            return NoContent();
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var material = await _context.RawMaterials.FindAsync(id);
            if (material == null)
                return NotFound();

            _context.RawMaterials.Remove(material);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
