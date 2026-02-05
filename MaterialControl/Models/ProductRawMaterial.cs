namespace MaterialControl.Models;

public class ProductRawMaterial
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    public int RawMaterialId { get; set; }
    public RawMaterial RawMaterial { get; set; }

    public decimal RequiredQuantity { get; set; }
}