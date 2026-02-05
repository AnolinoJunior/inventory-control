namespace MaterialControl.Models;

public class RawMaterial
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public decimal StockQuantity { get; set; }

    public ICollection<ProductRawMaterial> ProductRawMaterials { get; set; }
}
