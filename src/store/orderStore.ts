import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import type { CartItem } from '../assets/mock-data';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  product?: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
};

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface OrderState {
  orders: OrderWithItems[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getUserOrders: (userId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  addOrder: (
    userId: string,
    items: CartItem[],
    total: number,
    additionalData?: {
      shipping_cost?: number;
      tax_amount?: number;
      delivery_address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    }
  ) => Promise<OrderWithItems>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems: OrderWithItems[] = [];

      for (const order of orders) {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(
            `
            *,
            product:product_id (
              id,
              name,
              image_url,
              price
            )
          `
          )
          .eq('order_id', order.id);

        if (itemsError) throw itemsError;

        ordersWithItems.push({
          ...order,
          items: items || [],
        });
      }

      set({ orders: ordersWithItems, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  getUserOrders: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems: OrderWithItems[] = [];

      for (const order of orders) {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(
            `
            *,
            product:product_id (
              id,
              name,
              image_url,
              price
            )
          `
          )
          .eq('order_id', order.id);

        if (itemsError) throw itemsError;

        ordersWithItems.push({
          ...order,
          items: items || [],
        });
      }

      set({ orders: ordersWithItems, loading: false });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
      }));

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  },

  addOrder: async (
    userId: string,
    items: CartItem[],
    total: number,
    additionalData = {}
  ) => {
    try {
      // validate items before proceeding
      const validItems = items.filter((item) => item.product?.id);

      if (validItems.length === 0) {
        throw new Error('No valid items in cart');
      }

      // insert the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total_amount: total,
            status: 'pending',
            shipping_cost: additionalData.shipping_cost || 0,
            tax_amount: additionalData.tax_amount || 0,
            delivery_address: additionalData.delivery_address || null,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // insert order items
      const orderItems = validItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems).select(`
          *,
          product:product_id (
            id,
            name,
            image_url,
            price
          )
        `);

      if (itemsError) throw itemsError;

      const orderWithItems: OrderWithItems = {
        ...order,
        items: insertedItems || [],
      };

      // update the store state
      set((state) => ({
        orders: [orderWithItems, ...state.orders],
      }));

      return orderWithItems;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },
}));
