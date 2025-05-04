import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<Product[]>;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductsByCategory: (category: string | null) => Promise<Product[]>;
  searchProducts: (query: string) => Promise<Product[]>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  addProduct: async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ products: [data, ...state.products] }));
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        products: state.products.map(p => p.id === id ? data : p)
      }));
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        products: state.products.filter(p => p.id !== id)
      }));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  searchProducts: async (query) => {
    try {
      const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
      
      if (searchTerms.length === 0) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(
          searchTerms.map(term => 
            `or(name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%)`
          ).join(',')
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
}));