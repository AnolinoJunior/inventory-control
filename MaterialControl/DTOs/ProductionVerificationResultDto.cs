namespace MaterialControl.DTOs
{
    public class ProductionVerificationResultDto
    {
        public bool CanProduce { get; set; }
        public string Message { get; set; } = string.Empty;
        public int MaxProducible { get; set; }
        public List<MaterialShortageDto> Shortages { get; set; } = new();
    }
}
