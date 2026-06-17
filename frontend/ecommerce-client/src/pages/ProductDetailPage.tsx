import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ArrowLeft, ShoppingCart, Package, Zap, Shield } from 'lucide-react'
import { getProduct } from '@/api/products'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProduct(Number(id))
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

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
          <span className="text-8xl text-muted-foreground/20">📦</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary font-medium">{product.categoryName}</p>
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.5)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{product.price.toFixed(2)} Lei</span>
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stockQuantity > 10 ? 'text-green-500' : 'text-orange-500'}`}>
            {product.stockQuantity > 10
              ? `✓ In stock (${product.stockQuantity} available)`
              : `⚠ Only ${product.stockQuantity} left`}
          </p>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                className="px-3 py-2 hover:bg-muted transition-colors text-lg font-medium"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >−</button>
              <span className="px-4 py-2 text-sm font-medium border-x border-border">{quantity}</span>
              <button
                className="px-3 py-2 hover:bg-muted transition-colors text-lg font-medium"
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
              >+</button>
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

      {/* Description */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
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