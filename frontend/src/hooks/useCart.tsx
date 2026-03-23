import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem, MenuItem, Restaurant } from '../types';

interface CartContextValue {
  restaurantId: string | null;
  restaurantName: string;
  items: CartItem[];
  addItem: (restaurant: Restaurant, menuItem: MenuItem) => void;
  updateQty: (menuItemId: string, delta: number) => void;
  clear: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (restaurant: Restaurant, menuItem: MenuItem) => {
    if (restaurantId && restaurantId !== restaurant._id) {
      if (!confirm('Clear cart and switch restaurant?')) return;
      setItems([]);
    }
    setRestaurantId(restaurant._id);
    setRestaurantName(restaurant.name);
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItemId: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  };

  const updateQty = (menuItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clear = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName('');
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ restaurantId, restaurantName, items, addItem, updateQty, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
