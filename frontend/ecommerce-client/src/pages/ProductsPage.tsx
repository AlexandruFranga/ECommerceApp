import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Star, SlidersHorizontal } from 'lucide-react'
import { getProducts } from '@/api/products'
import { getCategories } from '@/api/categories'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import type { Product, Category } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()
  const { addItem } = useCartStore()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlCategory = searchParams.get('categoryId')
    setSearch(urlSearch)
    setSelectedCategory(urlCategory ? Number(urlCategory) : null)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    getProducts({
      search: search || undefined,
      categoryId: selectedCategory || undefined,
      sortBy: sortBy === 'default' ? undefined : sortBy,
      pageSize: 20
    })
      .then(data => setProducts(data.items))
      .finally(() => setLoading(false))
  }, [search, selectedCategory, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {search ? `Results for "${search}"` : 'Products'}
        </h1>
        <select
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:flex flex-col gap-4 w-48 shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            Categories
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{products.length} products found</p>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(null) }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="relative bg-muted h-40 flex items-center justify-center">
                    <span className="text-4xl text-muted-foreground/20">📦</span>
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">4.5</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold">{p.price.toFixed(2)} Lei</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs mt-1"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
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
          )}
        </div>
      </div>
    </div>
  )
}