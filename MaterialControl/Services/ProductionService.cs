using MaterialControl.Data;
using MaterialControl.Dtos;
using MaterialControl.DTOs;
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
            try
            {
               
                var rawMaterials = await _context.RawMaterials
                    .AsNoTracking()
                    .ToDictionaryAsync(r => r.Id, r => r.StockQuantity);

                var products = await _context.Products
                    .Include(p => p.ProductRawMaterials)
                    .ThenInclude(pr => pr.RawMaterial)
                    .AsNoTracking()
                    .Where(p => p.ProductRawMaterials.Any())
                    .OrderByDescending(p => p.Price)
                    .ToListAsync();

                var result = new List<ProductionProductDto>();
                decimal totalProductionValue = 0;

               
                var simulatedStock = new Dictionary<int, decimal>(rawMaterials);

                foreach (var product in products)
                {
                    var materials = product.ProductRawMaterials;

                    if (!materials.Any()) continue;

                   
                    decimal maxQuantity = decimal.MaxValue;

                    foreach (var m in materials)
                    {
                        decimal required = m.RequiredQuantity;
                        decimal available = simulatedStock.ContainsKey(m.RawMaterialId)
                            ? simulatedStock[m.RawMaterialId]
                            : 0;

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
                            simulatedStock[m.RawMaterialId] -= m.RequiredQuantity * productionQuantity;
                        }

                        decimal value = productionQuantity * product.Price;
                        totalProductionValue += value;

                        result.Add(new ProductionProductDto
                        {
                            ProductId = product.Id,
                            ProductCode = product.Code,
                            ProductName = product.Name,
                            UnitPrice = product.Price,
                            Quantity = productionQuantity,
                            TotalValue = value,
                            MaterialsUsed = materials.Select(m => new MaterialUsageDto
                            {
                                MaterialId = m.RawMaterialId,
                                MaterialName = m.RawMaterial.Name,
                                RequiredPerUnit = m.RequiredQuantity,
                                TotalUsed = m.RequiredQuantity * productionQuantity
                            }).ToList()
                        });
                    }
                }

                return new ProductionResultDto
                {
                    Products = result,
                    TotalProductionValue = totalProductionValue,
                    Success = true,
                    Message = result.Any()
                        ? $"Production suggestion: $ {totalProductionValue:F2}"
                        : "Insufficient stock to produce any products"
                };
            }
            catch (Exception ex)
            {
                return new ProductionResultDto
                {
                    Success = false,
                    Message = $"Erro: {ex.Message}"
                };
            }
        }

      
        public async Task<ProductionExecutionResultDto> ExecuteProductionAsync(int productId, int quantity)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var product = await _context.Products
                    .Include(p => p.ProductRawMaterials)
                    .FirstOrDefaultAsync(p => p.Id == productId);

                if (product == null)
                    return new ProductionExecutionResultDto
                    {
                        Success = false,
                        Message = "Product not found. Please check the product ID."
                    };

                
                foreach (var material in product.ProductRawMaterials)
                {
                    var rawMaterial = await _context.RawMaterials.FindAsync(material.RawMaterialId);
                    if (rawMaterial == null || rawMaterial.StockQuantity < material.RequiredQuantity * quantity)
                    {
                        return new ProductionExecutionResultDto
                        {
                            Success = false,
                            Message = $"Insufficient stock: {material.RawMaterial?.Name ?? "Material"}"
                        };
                    }
                }

                
                foreach (var material in product.ProductRawMaterials)
                {
                    var rawMaterial = await _context.RawMaterials.FindAsync(material.RawMaterialId);
                    rawMaterial!.StockQuantity -= material.RequiredQuantity * quantity;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ProductionExecutionResultDto
                {
                    Success = true,
                    ProductId = productId,
                    ProductName = product.Name,
                    QuantityProduced = quantity,
                    TotalValue = product.Price * quantity,
                    Message = $"Successfully produced {quantity} units"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ProductionExecutionResultDto
                {
                    Success = false,
                    Message = $"Erro: {ex.Message}"
                };
            }
        }
    }
}