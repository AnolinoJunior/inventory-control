using MaterialControl.Data;
using MaterialControl.Dtos;
using MaterialControl.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MaterialControl.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _context.Products
                .AsNoTracking()
                .Select(p => new
                {
                    p.Id,
                    p.Code,
                    p.Name,
                    p.Price
                })
                .ToListAsync();

            return Ok(products);
        }

     
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Code,
                    p.Name,
                    p.Price
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Post(ProductCreateDto dto)
        {
            var product = new Product
            {
                Code = dto.Code,
                Name = dto.Name,
                Price = dto.Price
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

     
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ProductUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Code = dto.Code;
            product.Name = dto.Name;
            product.Price = dto.Price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
