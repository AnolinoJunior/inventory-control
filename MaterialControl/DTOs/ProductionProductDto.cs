namespace MaterialControl.Dtos
{
    public class ProductionProductDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalValue { get; set; }
    }
}
