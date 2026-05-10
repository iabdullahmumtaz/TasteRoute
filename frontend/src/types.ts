export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string;
  rating: number;
  deliveryTime?: string;
  image?: string;
  menu?: MenuItem[];
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  restaurant?: Restaurant;
  items?: CartItem[];
  total?: number;
  status: OrderStatus;
  deliveryAddress?: string;
  createdAt?: string;
}
