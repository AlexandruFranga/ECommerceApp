import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getMyOrders } from '@/api/orders'
import type { Order } from '@/types'
import { ShoppingBag } from 'lucide-react'

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">No orders yet</h1>
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
        </div>
        <Link to="/products">
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
            Start shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Order header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                {order.status}
              </span>
              <span className="font-bold">{order.total.toFixed(2)} Lei</span>
            </div>
          </div>

          {/* Order items */}
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg">📦</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {item.unitPrice.toFixed(2)} Lei
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {(item.quantity * item.unitPrice).toFixed(2)} Lei
                </span>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          <div className="px-5 py-3 bg-muted/30 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Ship to: </span>
              {order.shippingAddress}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}