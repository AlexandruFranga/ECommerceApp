import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { updateCartItem } from '@/api/cart'

export default function CartPage() {
  const { items, fetchCart, removeItem, clearCart } = useCartStore()
  const { token } = useAuthStore()

  useEffect(() => {
    if (token) fetchCart()
  }, [token])

  const subtotal = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (quantity < 1) return
    await updateCartItem(id, quantity)
    await fetchCart()
  }

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Sign in to view your cart</h1>
          <p className="text-muted-foreground">You need to be logged in to add items to your cart.</p>
        </div>
        <Link to="/login">
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
            Sign in
          </Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
        </div>
        <Link to="/products">
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2">
            Browse products <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Items */}
        <div className="flex-1 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <span className="text-2xl text-muted-foreground/30">📦</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium line-clamp-2">{item.productName}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      className="px-2 py-1 hover:bg-muted transition-colors"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2 py-1 hover:bg-muted transition-colors"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-base font-bold">
                    {(item.productPrice * item.quantity).toFixed(2)} Lei
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => clearCart()}
            className="text-sm text-muted-foreground hover:text-red-500 transition-colors self-start mt-2"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 sticky top-24">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{subtotal.toFixed(2)} Lei</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? <span className="text-green-500">Free</span> : `${shipping.toFixed(2)} Lei`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">Free shipping on orders over 200 Lei</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{total.toFixed(2)} Lei</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold gap-2">
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/products" className="text-center text-sm text-primary hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}