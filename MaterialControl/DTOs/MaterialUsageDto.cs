namespace MaterialControl.DTOs
{
    public class MaterialUsageDto
    {
        public int MaterialId { get; set; }
        public string MaterialName { get; set; } = string.Empty;
        public decimal RequiredPerUnit { get; set; }
        public decimal TotalUsed { get; set; }
    }
}
