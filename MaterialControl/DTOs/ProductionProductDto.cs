using MaterialControl.DTOs;

namespace MaterialControl.Dtos
{
    public class ProductionProductDto
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalValue { get; set; }
        public List<MaterialUsageDto> MaterialsUsed { get; set; } = new();
    }
}
