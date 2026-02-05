using MaterialControl.Data;
using MaterialControl.Dtos;
using Microsoft.EntityFrameworkCore;

namespace MaterialControl.Services
{
    public class ProductionService
    {
        private readonly ApplicationDbContext _context;

        public ProductionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductionResultDto> CalculateAsync()
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
               
                var rawMaterials = await _context.RawMaterials
                    .AsNoTracking()
                    .ToDictionaryAsync(r => r.Id, r => r.StockQuantity);

                var products = await _context.Products
                    .Include(p => p.ProductRawMaterials)
                    .ThenInclude(pr => pr.RawMaterial)
                    .AsNoTracking()
                    .OrderByDescending(p => p.Price)
                    .ToListAsync();

                var result = new List<ProductionProductDto>();
                decimal totalProductionValue = 0;
                var stock = new Dictionary<int, decimal>(rawMaterials);

                foreach (var product in products)
                {
                    var materials = product.ProductRawMaterials;
                    
                    if (!materials.Any()) continue;

                    bool canProduce = materials.All(m => 
                        stock.ContainsKey(m.RawMaterialId) && 
                        stock[m.RawMaterialId] > 0);

                    if (!canProduce) continue;

                  
                    decimal maxQuantity = decimal.MaxValue;
                    
                    foreach (var m in materials)
                    {
                        decimal required = m.RequiredQuantity;
                        decimal available = stock[m.RawMaterialId];
                        
                
                        if (available < required)
                        {
                            maxQuantity = 0;
                            break;
                        }
                        
                        decimal possible = Math.Floor(available / required);
                        maxQuantity = Math.Min(maxQuantity, possible);
                    }

                    int productionQuantity = (int)maxQuantity;

                    if (productionQuantity > 0)
                    {
                    
                        foreach (var m in materials)
                        {
                            stock[m.RawMaterialId] -= m.RequiredQuantity * productionQuantity;
                        }

                
                        decimal value = productionQuantity * product.Price;
                        totalProductionValue += value;

                        result.Add(new ProductionProductDto
                        {
                            ProductName = product.Name,
                            UnitPrice = product.Price,
                            Quantity = productionQuantity,
                            TotalValue = value
                        });
                    }
                }

             
                await UpdateStockInDatabase(stock);
                
                await transaction.CommitAsync();

                return new ProductionResultDto
                {
                    Products = result,
                    TotalProductionValue = totalProductionValue
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task UpdateStockInDatabase(Dictionary<int, decimal> stock)
        {
            foreach (var item in stock)
            {
                var material = await _context.RawMaterials
                    .FirstOrDefaultAsync(r => r.Id == item.Key);
                    
                if (material != null)
                {
                    material.StockQuantity = item.Value;
                }
            }
            
            await _context.SaveChangesAsync();
        }
    }
}