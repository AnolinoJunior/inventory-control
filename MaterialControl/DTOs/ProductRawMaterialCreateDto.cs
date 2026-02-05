namespace MaterialControl.Dtos
{
    public class ProductRawMaterialCreateDto
    {
        public int ProductId { get; set; }
        public int RawMaterialId { get; set; }
        public decimal RequiredQuantity { get; set; }
    }
}