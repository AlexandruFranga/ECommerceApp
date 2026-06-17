namespace ECommerceApp.Api.Entities;

public class CartItem
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public AppUser User { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
}