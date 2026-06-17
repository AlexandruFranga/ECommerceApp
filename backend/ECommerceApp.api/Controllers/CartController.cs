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
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<List<CartItemDto>>> GetCart()
    {
        var items = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == GetUserId())
            .AsNoTracking()
            .Select(c => new CartItemDto
            {
                Id = c.Id,
                ProductId = c.ProductId,
                ProductName = c.Product.Name,
                ProductPrice = c.Product.Price,
                ProductImageUrl = c.Product.ImageUrl,
                Quantity = c.Quantity
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart(AddToCartDto dto)
    {
        var userId = GetUserId();
        var existing = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

        if (existing != null)
        {
            existing.Quantity += dto.Quantity;
        }
        else
        {
            _context.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            });
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int quantity)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());

        if (item == null) return NotFound();

        if (quantity <= 0)
            _context.CartItems.Remove(item);
        else
            item.Quantity = quantity;

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());

        if (item == null) return NotFound();

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var items = await _context.CartItems
            .Where(c => c.UserId == GetUserId())
            .ToListAsync();

        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}