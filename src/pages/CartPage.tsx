import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { items, removeItem, updateItemQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const {
    freeShippingEnabled,
    freeShippingThreshold,
    shippingCost,
    taxRate,
    fetchSettings,
  } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-primary-300 mb-6" />
        <h1 className="text-3xl font-bold text-primary-900 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-lg text-primary-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  // calculating subtotal, shipping and total using latest settings
  const subtotal = getTotalPrice();
  const shipping =
    freeShippingEnabled && subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* cart items */}
        <div className="lg:w-8/12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
              <div className="col-span-6 font-medium text-primary-700">
                Product
              </div>
              <div className="col-span-2 font-medium text-primary-700 text-center">
                Quantity
              </div>
              <div className="col-span-2 font-medium text-primary-700 text-right">
                Price
              </div>
              <div className="col-span-2 font-medium text-primary-700 text-right">
                Total
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                // защита от неизвестных продуктов
                if (!item.product) return null;

                const imageUrl =
                  item.product.image_url || item.product.image || '';

                return (
                  <div
                    key={`${item.product.id}-${item.color}-${item.size}`}
                    className="p-4 md:grid md:grid-cols-12 md:gap-4 items-center"
                  >
                    {/* product info */}
                    <div className="col-span-6 flex items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-col">
                        <h3 className="text-base font-medium text-primary-900">
                          <Link to={`/product/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-primary-500">
                          Color: {item.color}
                        </p>
                        <p className="mt-1 text-sm text-primary-500">
                          Size: {item.size}
                        </p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-500 md:hidden"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* quantity */}
                    <div className="col-span-2 mt-4 md:mt-0 flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-gray-600 hover:text-primary-900"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(
                              item.product.id,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-12 text-center border-0 focus:ring-0"
                        />
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-gray-600 hover:text-primary-900"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* price */}
                    <div className="col-span-2 mt-4 md:mt-0 text-right">
                      <p className="text-sm font-medium text-primary-900">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>

                    {/* total */}
                    <div className="col-span-2 mt-4 md:mt-0 text-right flex md:justify-end items-center">
                      <p className="text-sm font-medium text-primary-900 flex-1 md:flex-none">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-4 text-red-600 hover:text-red-500 hidden md:block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* cart actions */}
          <div className="mt-6 flex justify-between items-center">
            <Link
              to="/products"
              className="flex items-center text-accent-600 hover:text-accent-700"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                leftIcon={<RefreshCw size={16} />}
                onClick={() => {
                  fetchSettings();
                  window.location.reload();
                }}
              >
                Update Cart
              </Button>
              <Button
                variant="outline"
                leftIcon={<Trash2 size={16} />}
                onClick={clearCart}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>

        {/* order summary */}
        <div className="lg:w-4/12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-primary-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-primary-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Tax ({taxRate}%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-semibold text-primary-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-primary-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Link to="/checkout">
              <Button fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            {/* promocode */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-primary-900">
                  Promotion Code
                </h3>
                <button className="text-sm text-accent-600 hover:text-accent-700">
                  Apply a coupon
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                />
                <button className="bg-primary-900 text-white px-4 py-2 rounded-r-md hover:bg-primary-800">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* shipping */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-primary-900 mb-4">
              Shipping & Returns
            </h3>
            <div className="space-y-3 text-sm text-primary-600">
              {freeShippingEnabled && (
                <p>
                  Free shipping on orders over{' '}
                  {formatCurrency(freeShippingThreshold)}
                </p>
              )}
              <p>Standard shipping: {formatCurrency(shippingCost)}</p>
              <p>Free 30-day returns on all orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
