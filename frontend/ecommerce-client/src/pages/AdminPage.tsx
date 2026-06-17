import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCategories } from '@/api/categories'
import {
  adminGetProducts, adminCreateProduct,
  adminDeleteProduct, adminGetOrders, adminUpdateOrderStatus
} from '@/api/admin'
import type { Product, Order, Category } from '@/types'
import {
  Package, ShoppingCart, Users, TrendingUp,
  Plus, Pencil, Trash2, Search, X, Check
} from 'lucide-react'

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
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', stockQuantity: '', categoryId: ''
  })

  useEffect(() => {
    Promise.all([
      adminGetProducts(),
      adminGetOrders(),
      getCategories()
    ]).then(([prods, ords, cats]) => {
      setProducts(prods)
      setOrders(ords)
      setCategories(cats)
    }).finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredOrders = orders.filter(o =>
    o.shippingAddress.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toString().includes(search)
  )

  const handleDeleteProduct = async (id: number) => {
    await adminDeleteProduct(id)
    setProducts(products.filter(p => p.id !== id))
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) return
    const created = await adminCreateProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      stockQuantity: parseInt(newProduct.stockQuantity) || 0,
      categoryId: parseInt(newProduct.categoryId),
    })
    setProducts([...products, created])
    setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '' })
    setShowAddProduct(false)
  }

  const handleStatusChange = async (orderId: number, status: string) => {
    await adminUpdateOrderStatus(orderId, status)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">

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
              { label: 'Total Revenue', value: `${totalRevenue.toFixed(2)} Lei`, icon: <TrendingUp className="h-5 w-5 text-primary" />, sub: `From ${orders.filter(o => o.status !== 'Cancelled').length} orders` },
              { label: 'Total Orders', value: orders.length, icon: <ShoppingCart className="h-5 w-5 text-primary" />, sub: `${orders.filter(o => o.status === 'Pending').length} pending` },
              { label: 'Products', value: products.length, icon: <Package className="h-5 w-5 text-primary" />, sub: `${products.filter(p => p.stockQuantity < 10).length} low stock` },
              { label: 'Categories', value: categories.length, icon: <Users className="h-5 w-5 text-primary" />, sub: 'Product categories' },
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

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Recent Orders</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">#{order.id}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
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

          {showAddProduct && (
            <div className="bg-card border border-primary/30 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">New Product</h3>
                <button onClick={() => setShowAddProduct(false)}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-muted/50 col-span-2"
                />
                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="bg-muted/50 col-span-2"
                />
                <Input
                  placeholder="Price (Lei)"
                  type="number"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Stock"
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={e => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                  className="bg-muted/50"
                />
                <select
                  value={newProduct.categoryId}
                  onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="col-span-2 text-sm border border-border rounded-lg px-3 py-2 bg-muted/50 text-foreground"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                    <td className="px-5 py-3 text-muted-foreground">{p.categoryName}</td>
                    <td className="px-5 py-3">{p.price.toFixed(2)} Lei</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stockQuantity < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {p.stockQuantity} units
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
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-3">{order.items.length}</td>
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