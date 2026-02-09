
public class RawMaterialCreateDto
{
    public string Code { get; set; }       
    public string Name { get; set; }       
    public decimal StockQuantity { get; set; } 
}


public class RawMaterialUpdateDto
{
    public int Id { get; set; }           
    public string Code { get; set; }       
    public string Name { get; set; }       
    public decimal StockQuantity { get; set; } 
}