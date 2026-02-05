namespace MaterialControl.Dtos
{
    public class RawMaterialUpdateDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int StockQuantity { get; set; }
    }
}