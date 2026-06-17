using ECommerceApp.Api.Entities;
using Microsoft.AspNetCore.Identity;

namespace ECommerceApp.Api.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext context, UserManager<AppUser> userManager)
    {
        // Seed Categories
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new() { Name = "Microcontrollers", Description = "Arduino, ESP32, STM32 and more" },
                new() { Name = "Dev Boards", Description = "Raspberry Pi and development boards" },
                new() { Name = "Resistors", Description = "Carbon film and metal film resistors" },
                new() { Name = "Capacitors", Description = "Electrolytic and ceramic capacitors" },
                new() { Name = "Transistors", Description = "NPN, PNP and MOSFET transistors" },
                new() { Name = "LED & Lighting", Description = "LEDs and lighting components" },
                new() { Name = "Sensors", Description = "Temperature, humidity and motion sensors" },
                new() { Name = "Cables & Connectors", Description = "Jumper wires and connectors" },
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // Seed Products
        if (!context.Products.Any())
        {
            var categories = context.Categories.ToList();
            int GetCatId(string name) => categories.First(c => c.Name == name).Id;

            var products = new List<Product>
            {
                new() { Name = "Arduino Uno R3", Description = "Microcontroller board based on ATmega328P. 14 digital I/O pins, 6 analog inputs, 16MHz clock.", Price = 42.99m, StockQuantity = 15, CategoryId = GetCatId("Microcontrollers") },
                new() { Name = "ESP32 Development Board", Description = "Dual-core 240MHz microcontroller with Wi-Fi and Bluetooth. 30 GPIO pins, 4MB flash.", Price = 34.99m, StockQuantity = 23, CategoryId = GetCatId("Microcontrollers") },
                new() { Name = "STM32 Nucleo Board", Description = "STM32F103RB ARM Cortex-M3 development board with integrated ST-LINK debugger.", Price = 67.00m, StockQuantity = 11, CategoryId = GetCatId("Microcontrollers") },
                new() { Name = "Raspberry Pi 4 Model B 4GB", Description = "Quad-core 1.8GHz, 4GB RAM, dual 4K display, USB 3.0, Wi-Fi and Bluetooth.", Price = 189.99m, StockQuantity = 8, CategoryId = GetCatId("Dev Boards") },
                new() { Name = "Resistor Kit 600pcs", Description = "600 resistors across 30 values from 10Ω to 1MΩ. 1/4W carbon film, 5% tolerance.", Price = 18.50m, StockQuantity = 42, CategoryId = GetCatId("Resistors") },
                new() { Name = "NPN Transistor BC547 (50pcs)", Description = "General-purpose NPN transistors in TO-92 package. Vceo 45V, Ic 100mA.", Price = 8.99m, StockQuantity = 56, CategoryId = GetCatId("Transistors") },
                new() { Name = "Capacitor Kit 500pcs", Description = "500 electrolytic capacitors, 24 values from 0.1µF to 1000µF, 50V rating.", Price = 16.50m, StockQuantity = 28, CategoryId = GetCatId("Capacitors") },
                new() { Name = "LED Assortment Kit 350pcs", Description = "350 LEDs in 5 colors: red, green, blue, yellow, white. Standard 5mm through-hole.", Price = 22.00m, StockQuantity = 31, CategoryId = GetCatId("LED & Lighting") },
                new() { Name = "DHT22 Temperature Sensor", Description = "Digital temperature and humidity sensor. Range: -40°C to +80°C, ±0.5°C accuracy.", Price = 12.99m, StockQuantity = 19, CategoryId = GetCatId("Sensors") },
                new() { Name = "Jumper Wire Kit 120pcs", Description = "120 jumper wires: 40x M-M, 40x M-F, 40x F-F. 20cm length, 10 colors.", Price = 9.50m, StockQuantity = 74, CategoryId = GetCatId("Cables & Connectors") },
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }

        // Seed Admin user
        if (await userManager.FindByEmailAsync("admin@ecommerce.com") == null)
        {
            var admin = new AppUser
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@ecommerce.com",
                UserName = "admin@ecommerce.com"
            };

            await userManager.CreateAsync(admin, "Admin@123");
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}