import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/store/cartStore'
import { createOrder } from '@/api/orders'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  })

  const subtotal = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.address || !form.city || !form.phone) return
    setLoading(true)
    try {
      const shippingAddress = `${form.fullName}, ${form.address}, ${form.city}, ${form.phone}`
      const order = await createOrder(shippingAddress)
      setOrderId(order.id)
      await clearCart()
      setSuccess(true)
    } catch {
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Order placed!</h1>
          <p className="text-muted-foreground">
            Your order #{orderId} has been placed successfully. We'll process it shortly.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/products">
            <Button variant="outline">Continue shopping</Button>
          </Link>
          <Link to="/orders">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
              View my orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/cart">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold">Shipping details</h2>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="bg-muted/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="bg-muted/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="bg-muted/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-muted/50"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mt-2"
            disabled={loading}
          >
            {loading ? 'Placing order...' : `Place order — ${total.toFixed(2)} Lei`}
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg">📦</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">
                  {(item.productPrice * item.quantity).toFixed(2)} Lei
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{subtotal.toFixed(2)} Lei</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-500">Free</span> : `${shipping.toFixed(2)} Lei`}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
              <span>Total</span>
              <span>{total.toFixed(2)} Lei</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}