import api from './client'
import type { Product, Order } from '@/types'
import type { PaginatedResponse } from '@/types'

export const adminGetProducts = async () => {
  const response = await api.get<PaginatedResponse<Product>>('/products?pageSize=100')
  return response.data.items
}

export const adminCreateProduct = async (data: {
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryId: number
  imageUrl?: string
}) => {
  const response = await api.post<Product>('/products', data)
  return response.data
}

export const adminUpdateProduct = async (id: number, data: {
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryId: number
  imageUrl?: string
}) => {
  await api.put(`/products/${id}`, data)
}

export const adminDeleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`)
}

export const adminGetOrders = async () => {
  const response = await api.get<Order[]>('/orders/all')
  return response.data
}

export const adminUpdateOrderStatus = async (id: number, status: string) => {
  await api.patch(`/orders/${id}/status`, { status })
}