import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Package, ShoppingCart, Users, TrendingUp,
  Plus, Pencil, Trash2, Search, X, Check
} from 'lucide-react'

const mockProducts = [
  { id: 1, name: 'Arduino Uno R3', price: 42.99, stock: 15, category: 'Microcontrollers' },
  { id: 2, name: 'Raspberry Pi 4 Model B 4GB', price: 189.99, stock: 8, category: 'Dev Boards' },
  { id: 3, name: 'Resistor Kit 600pcs', price: 18.50, stock: 42, category: 'Resistors' },
  { id: 4, name: 'ESP32 Development Board', price: 34.99, stock: 23, category: 'Microcontrollers' },
  { id: 5, name: 'LED Assortment Kit 350pcs', price: 22.00, stock: 31, category: 'LED & Lighting' },
]

const mockOrders = [
  { id: 1001, customer: 'Ion Popescu', total: 227.98, status: 'Pending', date: '2026-06-15', items: 2 },
  { id: 1002, customer: 'Maria Ionescu', total: 18.50, status: 'Processing', date: '2026-06-15', items: 1 },
  { id: 1003, customer: 'Andrei Constantin', total: 224.98, status: 'Shipped', date: '2026-06-14', items: 3 },
  { id: 1004, customer: 'Elena Dumitrescu', total: 67.00, status: 'Delivered', date: '2026-06-13', items: 1 },
  { id: 1005, customer: 'Mihai Popa', total: 43.49, status: 'Cancelled', date: '2026-06-12', items: 2 },
]

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const tabs = ['Overview', 'Products', 'Orders']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(mockProducts)
  const [orders, setOrders] = useState(mockOrders)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' })

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredOrders = orders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toString().includes(search)
  )

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    setProducts([...products, {
      id: products.length + 1,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      category: newProduct.category || 'Uncategorized',
    }])
    setNewProduct({ name: '', price: '', stock: '', category: '' })
    setShowAddProduct(false)
  }

  const handleStatusChange = (orderId: number, status: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your store</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearch('') }}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: `${totalRevenue.toFixed(2)} Lei`, icon: <TrendingUp className="h-5 w-5 text-primary" />, sub: 'From 4 orders' },
              { label: 'Total Orders', value: mockOrders.length, icon: <ShoppingCart className="h-5 w-5 text-primary" />, sub: '1 pending' },
              { label: 'Products', value: products.length, icon: <Package className="h-5 w-5 text-primary" />, sub: '2 low stock' },
              { label: 'Customers', value: 5, icon: <Users className="h-5 w-5 text-primary" />, sub: 'Registered users' },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Recent Orders</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">#{order.id}</td>
                    <td className="px-5 py-3 text-muted-foreground">{order.customer}</td>
                    <td className="px-5 py-3 font-medium">{order.total.toFixed(2)} Lei</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === 'Products' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowAddProduct(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" /> Add product
            </Button>
          </div>

          {/* Add product form */}
          {showAddProduct && (
            <div className="bg-card border border-primary/30 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">New Product</h3>
                <button onClick={() => setShowAddProduct(false)}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="bg-muted/50 col-span-2" />
                <Input placeholder="Price (Lei)" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="bg-muted/50" />
                <Input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="bg-muted/50" />
                <Input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="bg-muted/50 col-span-2" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90 text-white gap-2">
                  <Check className="h-4 w-4" /> Save
                </Button>
                <Button variant="outline" onClick={() => setShowAddProduct(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Price</th>
                  <th className="text-left px-5 py-3 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-5 py-3">{p.price.toFixed(2)} Lei</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'Orders' && (
        <div className="flex flex-col gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9 bg-muted/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Items</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">#{order.id}</td>
                    <td className="px-5 py-3 text-muted-foreground">{order.customer}</td>
                    <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                    <td className="px-5 py-3">{order.items}</td>
                    <td className="px-5 py-3 font-medium">{order.total.toFixed(2)} Lei</td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border bg-transparent cursor-pointer ${statusColors[order.status]}`}
                      >
                        {Object.keys(statusColors).map(s => (
                          <option key={s} value={s} className="bg-background text-foreground">{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}