namespace MaterialControl.DTOs
{
    public class ProductionExecutionResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int QuantityProduced { get; set; }
        public decimal TotalValue { get; set; }
    }
}
