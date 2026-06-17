import api from './client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export const login = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterRequest) => {
  const response = await api.post<AuthResponse>('/auth/register', data)
  return response.data
}