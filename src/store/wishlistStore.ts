import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          if (!state.items.find(item => item.id === product.id)) {
            return { items: [...state.items, product] };
          }
          return state;
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);