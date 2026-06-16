import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">ECommerceApp</span>
        </div>
        <p>© 2026 All rights reserved.</p>
      </div>
    </footer>
  )
}