using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ECommerceApp.Api.Entities;

namespace ECommerceApp.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        builder.Entity<OrderItem>()
            .Property(o => o.UnitPrice)
            .HasColumnType("decimal(18,2)");

        builder.Entity<Product>()
            .Property(p => p.Specifications)
            .HasColumnType("jsonb");
    }
}