import { ShoppingCart, Zap, Moon, Sun, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export default function Header() {
  const items = useCartStore((s) => s.items)
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight shrink-0">
          <Zap className="h-5 w-5 text-primary" />
          <span className="hidden sm:block">ECommerceApp</span>
        </Link>

        {/* Search */}
        <div className="flex-1 flex items-center max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-muted/50 border-border focus:bg-background w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            className="text-muted-foreground hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-4 w-4" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>

          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-sm font-medium hidden sm:flex">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}