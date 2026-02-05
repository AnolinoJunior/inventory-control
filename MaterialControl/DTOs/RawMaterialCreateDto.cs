namespace MaterialControl.Dtos
{
    public class RawMaterialCreateDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal StockQuantity { get; set; }
    }
}
