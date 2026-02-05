using MaterialControl.Data;
using MaterialControl.Dtos;
using MaterialControl.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MaterialControl.Controllers
{
    [ApiController]
    [Route("api/productrawmaterials")]
    public class ProductRawMaterialController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductRawMaterialController(ApplicationDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var list = await _context.ProductRawMaterials
                .AsNoTracking()
                .Select(pr => new
                {
                    pr.Id,
                    pr.ProductId,
                    ProductName = pr.Product.Name,
                    pr.RawMaterialId,
                    RawMaterialName = pr.RawMaterial.Name,
                    pr.RequiredQuantity
                })
                .ToListAsync();

            return Ok(list);
        }

  
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.ProductRawMaterials
                .AsNoTracking()
                .Where(pr => pr.Id == id)
                .Select(pr => new
                {
                    pr.Id,
                    pr.ProductId,
                    ProductName = pr.Product.Name,
                    pr.RawMaterialId,
                    RawMaterialName = pr.RawMaterial.Name,
                    pr.RequiredQuantity
                })
                .FirstOrDefaultAsync();

            if (item == null)
                return NotFound();

            return Ok(item);
        }

     
        [HttpPost]
        public async Task<IActionResult> Post(ProductRawMaterialCreateDto dto)
        {
            var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
            var rawExists = await _context.RawMaterials.AnyAsync(r => r.Id == dto.RawMaterialId);

            if (!productExists || !rawExists)
                return BadRequest("Product or RawMaterial does not exist.");

            var item = new ProductRawMaterial
            {
                ProductId = dto.ProductId,
                RawMaterialId = dto.RawMaterialId,
                RequiredQuantity = dto.RequiredQuantity
            };

            _context.ProductRawMaterials.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ProductRawMaterialUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var item = await _context.ProductRawMaterials.FindAsync(id);
            if (item == null)
                return NotFound();

            item.ProductId = dto.ProductId;
            item.RawMaterialId = dto.RawMaterialId;
            item.RequiredQuantity = dto.RequiredQuantity;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]    
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.ProductRawMaterials.FindAsync(id);
            if (item == null)
                return NotFound();

            _context.ProductRawMaterials.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
