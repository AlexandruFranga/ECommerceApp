import { create } from 'zustand'
import type { CartItem } from '../types'
import { getCart, addToCart, removeFromCart, clearCart } from '@/api/cart'

interface CartState {
  items: CartItem[]
  loading: boolean
  fetchCart: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  removeItem: (id: number) => Promise<void>
  clearCart: () => Promise<void>
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  fetchCart: async () => {
    try {
      const items = await getCart()
      set({ items })
    } catch {
      set({ items: [] })
    }
  },
  addItem: async (productId, quantity = 1) => {
    await addToCart(productId, quantity)
    await get().fetchCart()
  },
  removeItem: async (id) => {
    await removeFromCart(id)
    await get().fetchCart()
  },
  clearCart: async () => {
    await clearCart()
    set({ items: [] })
  },
  total: () => get().items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  ),
}))