using Microsoft.AspNetCore.Identity;

namespace ECommerceApp.Api.Entities;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}