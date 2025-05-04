import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  ShoppingBag,
  Users,
  ShoppingCart,
  Package,
  BarChart4,
  Settings,
  LogOut,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuthStore();
  const [freeShipping, setFreeShipping] = useState(true);
  const [shippingThreshold, setShippingThreshold] = useState(100);
  const [shippingCost, setShippingCost] = useState(10);
  const [taxRate, setTaxRate] = useState(8);
  const [loading, setLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    } else {
      loadSettings();
    }
  }, [isAdmin, navigate]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setSettingsId(data.id);
        setFreeShipping(data.free_shipping_enabled);
        setShippingThreshold(data.free_shipping_threshold);
        setShippingCost(data.shipping_cost);
        setTaxRate(data.tax_rate);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setNotification({ type: 'error', message: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settingsId) {
      setNotification({
        type: 'error',
        message: 'Settings ID not found. Please refresh the page.',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          free_shipping_enabled: freeShipping,
          free_shipping_threshold: shippingThreshold,
          shipping_cost: shippingCost,
          tax_rate: taxRate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingsId);

      if (error) throw error;

      setNotification({
        type: 'success',
        message: 'Settings saved successfully!',
      });

      // notif timeout
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        type: 'error',
        message: 'Failed to save settings. Please try again.',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  if (loading) {
    return <div className="flex-1 pl-64 p-8">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* sidebar */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-0 bottom-0 overflow-y-auto z-40">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>

          <nav className="space-y-2">
            <Link
              to="/admin"
              className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-primary-50"
            >
              <BarChart4 size={20} className="mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-primary-50"
            >
              <ShoppingBag size={20} className="mr-3" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-primary-50"
            >
              <ShoppingCart size={20} className="mr-3" />
              Orders
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center py-2 px-4 rounded-md transition-colors bg-primary-100 text-primary-900"
            >
              <Settings size={20} className="mr-3" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-200 p-6 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center text-primary-600 hover:text-primary-900 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 pl-64">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-8">Store Settings</h1>

          <form
            onSubmit={handleSubmit}
            className="max-w-2xl bg-white p-6 rounded-lg shadow"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Shipping Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={freeShipping}
                        onChange={(e) => setFreeShipping(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Enable Free Shipping
                      </span>
                    </label>
                  </div>

                  {freeShipping && (
                    <Input
                      label="Free Shipping Threshold ($)"
                      type="number"
                      value={shippingThreshold}
                      onChange={(e) =>
                        setShippingThreshold(Number(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      fullWidth
                    />
                  )}

                  <Input
                    label="Standard Shipping Cost ($)"
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    disabled={freeShipping}
                    fullWidth
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Tax Settings</h2>
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  fullWidth
                />
              </div>

              <Button type="submit" className="mt-6">
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
