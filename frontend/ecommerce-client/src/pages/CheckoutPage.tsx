import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRight, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getProducts } from '@/api/products'
import { getCategories } from '@/api/categories'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import type { Product, Category } from '@/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { token } = useAuthStore()
  const { addItem } = useCartStore()

  useEffect(() => {
    getProducts({ pageSize: 5 }).then(data => setProducts(data.items))
    getCategories().then(setCategories)
  }, [])

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
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/40 transition-all text-center"
            >
              <span className="text-2xl">📦</span>
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
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="relative bg-muted h-44 flex items-center justify-center">
                <span className="text-4xl text-muted-foreground/30">📦</span>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {p.name}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-xs font-medium">4.5</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold">{p.price.toFixed(2)} Lei</span>
                </div>
                <Button
                  size="sm"
                  className="mt-1 w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs"
                  onClick={async (e) => {
                    e.preventDefault()
                    if (!token) { window.location.href = '/login'; return }
                    await addItem(p.id, 1)
                  }}
                >
                  Add to cart
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}