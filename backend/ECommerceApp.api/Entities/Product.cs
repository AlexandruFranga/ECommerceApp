using System.Text.Json;

namespace ECommerceApp.Api.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public JsonDocument? Specifications { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}