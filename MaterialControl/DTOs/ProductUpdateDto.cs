namespace MaterialControl.Dtos
{
    public class ProductUpdateDto
    {
        public int Id { get; set; }        
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}