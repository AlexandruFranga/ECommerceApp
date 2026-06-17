namespace ECommerceApp.Api.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
    public decimal Total { get; set; }
}

public class CreateOrderDto
{
    public string ShippingAddress { get; set; } = string.Empty;
}

public class UpdateOrderStatusDto
{
    public string Status { get; set; } = string.Empty;
}