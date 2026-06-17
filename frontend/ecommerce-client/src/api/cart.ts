import api from './client'
import type { CartItem } from '@/types'

export const getCart = async () => {
  const response = await api.get<CartItem[]>('/cart')
  return response.data
}

export const addToCart = async (productId: number, quantity: number = 1) => {
  await api.post('/cart', { productId, quantity })
}

export const updateCartItem = async (id: number, quantity: number) => {
  await api.put(`/cart/${id}`, quantity)
}

export const removeFromCart = async (id: number) => {
  await api.delete(`/cart/${id}`)
}

export const clearCart = async () => {
  await api.delete('/cart')
}