// src/store/useCartStore.ts
import { create } from 'zustand';
import type { Product } from '../types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((item) => item.id !== productId) };
      }
      return {
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    }),
  clearCart: () => set({ cart: [] }),
}));