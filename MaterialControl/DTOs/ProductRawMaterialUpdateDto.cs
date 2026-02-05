namespace MaterialControl.Dtos
{
    public class ProductRawMaterialUpdateDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int RawMaterialId { get; set; }
        public decimal RequiredQuantity { get; set; }
    }
}