import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addOrder } = useOrderStore();
  const {
    freeShippingEnabled,
    freeShippingThreshold,
    shippingCost,
    taxRate,
    fetchSettings,
  } = useSettingsStore();

  const [isProcessing, setIsProcessing] = useState(false);

  // fetch latest settings
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // calculate totals using the latest settings
  const subtotal = getTotalPrice();
  const shipping =
    freeShippingEnabled && subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!user) throw new Error('User not authenticated');

      // create new order with the current settings values
      const order = await addOrder(user.id, items, total, {
        shipping_cost: shipping,
        tax_amount: tax,
        delivery_address: {
          street: (e.target as any).street.value,
          city: (e.target as any).city.value,
          state: (e.target as any).state.value,
          zip: (e.target as any).zip.value,
          country: 'United States',
        },
      });

      // clear cart
      clearCart();

      // show success message with shortened order id
      alert('Order placed successfully! Order ID: #' + order.id.slice(0, 8));

      // redirect to orders page
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* checkout form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* contact information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  required
                  fullWidth
                  defaultValue={user.name.split(' ')[0]}
                />
                <Input
                  label="Last Name"
                  type="text"
                  required
                  fullWidth
                  defaultValue={user.name.split(' ')[1] || ''}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  className="md:col-span-2"
                  defaultValue={user.email}
                />
                <Input
                  label="Phone"
                  type="tel"
                  required
                  fullWidth
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* shipping address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <Input
                  name="street"
                  label="Street Address"
                  type="text"
                  required
                  fullWidth
                />
                <Input label="Apartment, suite, etc." type="text" fullWidth />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    name="city"
                    label="City"
                    type="text"
                    required
                    fullWidth
                  />
                  <Input
                    name="state"
                    label="State"
                    type="text"
                    required
                    fullWidth
                  />
                  <Input
                    name="zip"
                    label="ZIP Code"
                    type="text"
                    required
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {/* payment information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Payment Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  type="text"
                  required
                  fullWidth
                  leftIcon={<CreditCard size={18} />}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    label="Expiration Date"
                    type="text"
                    placeholder="MM/YY"
                    required
                    fullWidth
                  />
                  <Input label="CVV" type="text" required fullWidth />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth isLoading={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
            </Button>
          </form>
        </div>

        {/* order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* order items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.color}-${item.size}`}
                  className="flex items-center"
                >
                  <div className="h-16 w-16 flex-shrink-0">
                    <img
                      src={item.product.image_url || item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* totals */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-medium border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* additional information */}
            <div className="mt-6 space-y-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Truck size={18} className="mr-2" />
                <span>
                  {freeShippingEnabled
                    ? `Free shipping on orders over ${formatCurrency(
                        freeShippingThreshold
                      )}`
                    : `Flat rate shipping: ${formatCurrency(shippingCost)}`}
                </span>
              </div>
              <div className="flex items-center">
                <Shield size={18} className="mr-2" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
