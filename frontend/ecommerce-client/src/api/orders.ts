import api from './client'
import type { Order } from '@/types'

export const createOrder = async (shippingAddress: string) => {
  const response = await api.post<Order>('/orders', { shippingAddress })
  return response.data
}

export const getMyOrders = async () => {
  const response = await api.get<Order[]>('/orders')
  return response.data
}