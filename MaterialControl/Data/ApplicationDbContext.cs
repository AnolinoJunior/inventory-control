namespace MaterialControl.Data;

using MaterialControl.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<RawMaterial> RawMaterials { get; set; }
    public DbSet<ProductRawMaterial> ProductRawMaterials { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .ToTable("products");

        modelBuilder.Entity<RawMaterial>()
            .ToTable("raw_materials");

        modelBuilder.Entity<ProductRawMaterial>()
            .ToTable("product_raw_materials");

        modelBuilder.Entity<ProductRawMaterial>()
            .HasIndex(p => new { p.ProductId, p.RawMaterialId })
            .IsUnique();
    }

}

