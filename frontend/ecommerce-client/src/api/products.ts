import api from './client'
import type { Product, PaginatedResponse } from '../types'

export const getProducts = async (params?: {
  search?: string
  categoryId?: number
  sortBy?: string
  page?: number
  pageSize?: number
}) => {
  const response = await api.get<PaginatedResponse<Product>>('/products', { params })
  return response.data
}

export const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/products/${id}`)
  return response.data
}