import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface StoreSettings {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  shippingCost: number;
  taxRate: number;
}

interface SettingsState extends StoreSettings {
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  freeShippingEnabled: true,
  freeShippingThreshold: 100,
  shippingCost: 10,
  taxRate: 8,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        set({
          freeShippingEnabled: data.free_shipping_enabled,
          freeShippingThreshold: data.free_shipping_threshold,
          shippingCost: data.shipping_cost,
          taxRate: data.tax_rate,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ error: 'Failed to fetch settings', loading: false });
    }
  }
}));