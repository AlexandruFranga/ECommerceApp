namespace ECommerceApp.Api.Entities;

public class Order
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public AppUser User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string ShippingAddress { get; set; } = string.Empty;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}