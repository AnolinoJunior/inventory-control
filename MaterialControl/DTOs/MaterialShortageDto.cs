namespace MaterialControl.DTOs
{
    public class MaterialShortageDto
    {
        public int MaterialId { get; set; }
        public string MaterialName { get; set; } = string.Empty;
        public decimal Available { get; set; }
        public decimal Required { get; set; }
        public decimal Shortage { get; set; }
    }
}
