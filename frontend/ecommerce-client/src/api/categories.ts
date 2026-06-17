import api from './client'
import type { Category } from '../types'

export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories')
  return response.data
}
