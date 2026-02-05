namespace MaterialControl.Dtos
{
    public class ProductionResultDto
    {
        public List<ProductionProductDto> Products { get; set; } = new List<ProductionProductDto>();
        public decimal TotalProductionValue { get; set; }
    }
}