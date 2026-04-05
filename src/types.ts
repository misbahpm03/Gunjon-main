export type Role = 'admin' | 'manager' | 'cashier';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  images: string[];
  isNew?: boolean;
  description: string;
  keySpecs: string[];
  fullSpecs: Record<string, string>;
  warranty: string;
  storage?: string;
  popularity: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  items: number;
  itemsList?: OrderItem[];
  paymentMethod?: string;
  deliveryAddress?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  orders: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  startDate: string;
  endDate: string;
  productIds?: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}
