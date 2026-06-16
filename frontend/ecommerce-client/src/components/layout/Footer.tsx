import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Zap className="h-4 w-4 text-yellow-500" />
          ECommerceApp
        </div>
        <div className="flex gap-6">
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        </div>
        <p>© 2026 ECommerceApp. All rights reserved.</p>
      </div>
    </footer>
  )
}