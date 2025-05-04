import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../assets/mock-data';
import { supabase } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    size: string,
    color: string
  ) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, size, color) => {
        if (!product?.id) return; // защита от неизвестного продукта]

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product?.id === product.id &&
              item.size === size &&
              item.color === color
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            // проверка на валидный обьект
            const validProduct = {
              id: product.id,
              name: product.name || '',
              price: product.price || 0,
              image_url: product.image_url || product.image || '',
              description: product.description || '',
            };

            return {
              items: [
                ...state.items,
                {
                  product: validProduct,
                  quantity,
                  size,
                  color,
                },
              ],
            };
          }
        });
      },

      removeItem: (productId) => {
        if (!productId) return; // защита от неизвестного productid

        set((state) => ({
          items: state.items.filter((item) => item.product?.id !== productId),
        }));
      },

      updateItemQuantity: (productId, quantity) => {
        if (!productId) return; // защита от неизвестного productid

        set((state) => ({
          items: state.items.map((item) =>
            item.product?.id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product?.price || 0;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
