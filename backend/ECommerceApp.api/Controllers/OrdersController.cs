using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerceApp.Api.Data;
using ECommerceApp.Api.DTOs;
using ECommerceApp.Api.Entities;

namespace ECommerceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == GetUserId())
            .AsNoTracking()
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                Status = o.Status,
                ShippingAddress = o.ShippingAddress,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity
                }).ToList(),
                Total = o.Items.Sum(i => i.UnitPrice * i.Quantity)
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        var userId = GetUserId();
        var cartItems = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
            return BadRequest("Cart is empty");

        var order = new Order
        {
            UserId = userId,
            ShippingAddress = dto.ShippingAddress,
            Status = "Pending",
            Items = cartItems.Select(c => new OrderItem
            {
                ProductId = c.ProductId,
                ProductName = c.Product.Name,
                UnitPrice = c.Product.Price,
                Quantity = c.Quantity
            }).ToList()
        };

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return Ok(new OrderDto
        {
            Id = order.Id,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList(),
            Total = order.Items.Sum(i => i.UnitPrice * i.Quantity)
        });
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderDto>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .AsNoTracking()
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                Status = o.Status,
                ShippingAddress = o.ShippingAddress,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity
                }).ToList(),
                Total = o.Items.Sum(i => i.UnitPrice * i.Quantity)
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.Status = dto.Status;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}