import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRight, Star } from 'lucide-react'

const categories = [
  { name: 'Microcontrollers', emoji: '🔲', to: '/products?category=microcontrollers' },
  { name: 'Resistors', emoji: '🔴', to: '/products?category=resistors' },
  { name: 'Capacitors', emoji: '🔵', to: '/products?category=capacitors' },
  { name: 'LED & Lighting', emoji: '💡', to: '/products?category=leds' },
  { name: 'Transistors', emoji: '⚡', to: '/products?category=transistors' },
  { name: 'Dev Boards', emoji: '🛠️', to: '/products?category=devboards' },
  { name: 'Sensors', emoji: '📡', to: '/products?category=sensors' },
  { name: 'Cables & Connectors', emoji: '🔌', to: '/products?category=cables' },
]

const featuredProducts = [
  {
    id: 1,
    name: 'Arduino Uno R3',
    price: 42.99,
    oldPrice: 54.99,
    rating: 4.8,
    reviews: 124,
    badge: 'Best seller',
    image: null,
  },
  {
    id: 2,
    name: 'Raspberry Pi 4 Model B 4GB',
    price: 189.99,
    oldPrice: null,
    rating: 4.9,
    reviews: 89,
    badge: 'New',
    image: null,
  },
  {
    id: 3,
    name: 'Resistor Kit 600pcs',
    price: 18.50,
    oldPrice: 24.00,
    rating: 4.6,
    reviews: 203,
    badge: 'Sale',
    image: null,
  },
  {
    id: 4,
    name: 'ESP32 Development Board',
    price: 34.99,
    oldPrice: null,
    rating: 4.7,
    reviews: 67,
    badge: null,
    image: null,
  },
  {
    id: 5,
    name: 'LED Assortment Kit 350pcs',
    price: 22.00,
    oldPrice: 28.00,
    rating: 4.5,
    reviews: 155,
    badge: 'Sale',
    image: null,
  },
]

const badgeColors: Record<string, string> = {
  'Best seller': 'bg-orange-500 text-white',
  'New': 'bg-blue-500 text-white',
  'Sale': 'bg-red-500 text-white',
}

function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
    >
      {/* Image placeholder */}
      <div className="relative bg-muted h-44 flex items-center justify-center">
        {product.badge && (
          <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}
        <span className="text-4xl text-muted-foreground/30">📦</span>
        <p className="absolute bottom-2 text-[10px] text-muted-foreground">
          add image later
        </p>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold">{product.price.toFixed(2)} Lei</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.oldPrice.toFixed(2)} Lei
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="mt-1 w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs"
          onClick={(e) => e.preventDefault()}
        >
          Add to cart
        </Button>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-6 w-full">

      {/* Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary p-8 flex flex-col gap-3 text-white">
        <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Limited time</p>
        <h1 className="text-3xl md:text-4xl font-bold">Up to 30% off<br />starter kits</h1>
        <p className="text-sm opacity-75 max-w-sm">
          Everything you need to get your first project running. Boards, sensors, cables — bundled and discounted.
        </p>
        <Link to="/products" className="mt-2 w-fit">
          <Button variant="secondary" size="sm" className="font-semibold gap-1">
            Shop now <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Categories */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Shop by category</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            All categories <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/40 transition-all text-center"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[11px] font-medium leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured products</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  )
}