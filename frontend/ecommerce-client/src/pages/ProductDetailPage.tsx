import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ArrowLeft, ShoppingCart, Package, Zap, Shield } from 'lucide-react'

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

export default function ProductDetailPage() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = mockProducts.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-muted-foreground">
        <p className="text-xl font-medium">Product not found.</p>
        <Link to="/products">
          <Button variant="outline">Back to products</Button>
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image */}
        <div className="relative bg-muted rounded-2xl flex items-center justify-center h-80 md:h-96">
          {product.badge && (
            <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[product.badge]}`}>
              {product.badge}
            </span>
          )}
          <span className="text-8xl text-muted-foreground/20">📦</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary font-medium">{product.category}</p>
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{product.price.toFixed(2)} Lei</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toFixed(2)} Lei</span>
            )}
            {product.oldPrice && (
              <Badge className="bg-red-500 text-white text-xs">
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
            {product.stock > 10 ? `✓ In stock (${product.stock} available)` : `⚠ Only ${product.stock} left`}
          </p>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                className="px-3 py-2 hover:bg-muted transition-colors text-lg font-medium"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-border">{quantity}</span>
              <button
                className="px-3 py-2 hover:bg-muted transition-colors text-lg font-medium"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {added ? 'Added!' : 'Add to cart'}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {[
              { icon: <Package className="h-4 w-4 text-primary" />, text: 'In stock, ready to ship' },
              { icon: <Zap className="h-4 w-4 text-primary" />, text: 'Fast delivery 1-3 business days' },
              { icon: <Shield className="h-4 w-4 text-primary" />, text: '30-day return policy' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Specifications</h2>
          <div className="border border-border rounded-xl overflow-hidden">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div
                key={key}
                className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-muted/40' : 'bg-background'}`}
              >
                <span className="text-muted-foreground">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back button */}
      <div>
        <Link to="/products">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Button>
        </Link>
      </div>

    </div>
  )
}