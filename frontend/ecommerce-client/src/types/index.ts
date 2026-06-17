export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
  category?: Category;
  categoryName?: string;
  specifications?: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Customer' | 'Admin';
}

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}