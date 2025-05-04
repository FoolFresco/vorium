import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, ImageOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { formatCurrency } from '../lib/utils';

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getUserOrders, orders, loading } = useOrderStore();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      getUserOrders(user.id);
    }
  }, [isAuthenticated, navigate, user, getUserOrders]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Loading orders...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-primary-300 mb-6" />
          <h2 className="text-2xl font-medium text-primary-800 mb-4">No orders yet</h2>
          <p className="text-primary-600">
            When you place an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-primary-900">
                    Order #{order.id.slice(0, 8)}
                  </h2>
                  <p className="text-sm text-primary-600">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {order.status === 'delivered' && <CheckCircle size={16} className="mr-2" />}
                    {order.status === 'processing' && <Package size={16} className="mr-2" />}
                    {order.status === 'shipped' && <Truck size={16} className="mr-2" />}
                    {order.status === 'cancelled' && <XCircle size={16} className="mr-2" />}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-b border-gray-200 py-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center py-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.product?.image_url || item.product?.image ? (
                        <img
                          src={item.product.image_url || item.product.image}
                          alt={item.product?.name || 'Product'}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <ImageOff className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex-1">
                      <h3 className="text-base font-medium text-primary-900">
                        {item.product?.name || 'Product no longer available'}
                      </h3>
                      <p className="mt-1 text-sm text-primary-600">
                        Color: {item.color || 'N/A'} | Size: {item.size || 'N/A'}
                      </p>
                      <p className="mt-1 text-sm text-primary-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-primary-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm text-primary-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total_amount - (order.shipping_cost || 0) - (order.tax_amount || 0))}</span>
                </div>
                <div className="flex justify-between text-sm text-primary-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shipping_cost || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-primary-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax_amount || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-primary-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;