import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Star, SlidersHorizontal } from 'lucide-react'

const categories = [
  'All',
  'Microcontrollers',
  'Resistors',
  'Capacitors',
  'LED & Lighting',
  'Transistors',
  'Dev Boards',
  'Sensors',
  'Cables & Connectors',
]

const mockProducts = [
  { id: 1, name: 'Arduino Uno R3', price: 42.99, oldPrice: 54.99, rating: 4.8, reviews: 124, category: 'Microcontrollers', badge: 'Best seller' },
  { id: 2, name: 'Raspberry Pi 4 Model B 4GB', price: 189.99, oldPrice: null, rating: 4.9, reviews: 89, category: 'Dev Boards', badge: 'New' },
  { id: 3, name: 'Resistor Kit 600pcs', price: 18.50, oldPrice: 24.00, rating: 4.6, reviews: 203, category: 'Resistors', badge: 'Sale' },
  { id: 4, name: 'ESP32 Development Board', price: 34.99, oldPrice: null, rating: 4.7, reviews: 67, category: 'Microcontrollers', badge: null },
  { id: 5, name: 'LED Assortment Kit 350pcs', price: 22.00, oldPrice: 28.00, rating: 4.5, reviews: 155, category: 'LED & Lighting', badge: 'Sale' },
  { id: 6, name: 'DHT22 Temperature Sensor', price: 12.99, oldPrice: null, rating: 4.4, reviews: 98, category: 'Sensors', badge: null },
  { id: 7, name: 'Capacitor Kit 500pcs', price: 16.50, oldPrice: null, rating: 4.3, reviews: 71, category: 'Capacitors', badge: null },
  { id: 8, name: 'NPN Transistor BC547 (50pcs)', price: 8.99, oldPrice: 11.00, rating: 4.6, reviews: 180, category: 'Transistors', badge: 'Sale' },
  { id: 9, name: 'Jumper Wire Kit 120pcs', price: 9.50, oldPrice: null, rating: 4.7, reviews: 312, category: 'Cables & Connectors', badge: 'Best seller' },
  { id: 10, name: 'STM32 Nucleo Board', price: 67.00, oldPrice: null, rating: 4.8, reviews: 44, category: 'Dev Boards', badge: 'New' },
]

const badgeColors: Record<string, string> = {
  'Best seller': 'bg-orange-500 text-white',
  'New': 'bg-blue-500 text-white',
  'Sale': 'bg-red-500 text-white',
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  const filtered = mockProducts
    .filter((p) =>
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-muted/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:flex flex-col gap-4 w-48 shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            Categories
          </div>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try a different search or category.</p>
              <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory('All') }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="relative bg-muted h-40 flex items-center justify-center">
                    {p.badge && (
                      <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[p.badge]}`}>
                        {p.badge}
                      </span>
                    )}
                    <span className="text-4xl text-muted-foreground/30">📦</span>
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">{p.rating}</span>
                      <span className="text-xs text-muted-foreground">({p.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold">{p.price.toFixed(2)} Lei</span>
                      {p.oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">{p.oldPrice.toFixed(2)} Lei</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs mt-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      Add to cart
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}