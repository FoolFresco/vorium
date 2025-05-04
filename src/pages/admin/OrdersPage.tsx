import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingBag,
  BarChart4,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { formatCurrency } from '../../lib/utils';
import Button from '../../components/ui/Button';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuthStore();
  const { orders, fetchOrders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [isAdmin, navigate, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setSelectedOrder(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* sidebar */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-0 bottom-0 overflow-y-auto z-50">
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
              className="flex items-center py-2 px-4 rounded-md transition-colors bg-primary-100 text-primary-900"
            >
              <ShoppingCart size={20} className="mr-3" />
              Orders
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-primary-50"
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Order Management</h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const csv =
                    'data:text/csv;charset=utf-8,' +
                    'Order ID,Date,Customer,Total,Status\n' +
                    orders
                      .map(
                        (order) =>
                          `${order.id},${new Date(
                            order.created_at
                          ).toLocaleDateString()},Customer #${order.user_id},${
                            order.total_amount
                          },${order.status}`
                      )
                      .join('\n');
                  const link = document.createElement('a');
                  link.href = encodeURI(csv);
                  link.download = 'orders.csv';
                  link.click();
                }}
              >
                Export Orders
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">All Orders</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        Customer #{order.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {selectedOrder === order.id ? (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            autoFocus
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setSelectedOrder(order.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            <span className="mr-1.5">
                              {getStatusIcon(order.status)}
                            </span>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        <button
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.innerHTML = `
                              <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div class="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                  <h2 class="text-xl font-bold mb-4">Order Details #${order.id.slice(
                                    0,
                                    8
                                  )}</h2>
                                  <div class="space-y-4">
                                    ${order.items
                                      .map(
                                        (item) => `
                                      <div class="flex items-center border-b pb-4">
                                        <div class="h-16 w-16 flex-shrink-0">
                                          <img
                                            src="${
                                              item.product?.image_url || ''
                                            }"
                                            alt="${
                                              item.product?.name || 'Product'
                                            }"
                                            class="h-full w-full object-cover rounded"
                                          />
                                        </div>
                                        <div class="flex-1 ml-4">
                                          <h3 class="font-medium">${
                                            item.product?.name || 'Product'
                                          }</h3>
                                          <p class="text-sm text-gray-600">
                                            Size: ${item.size} | Color: ${
                                          item.color
                                        } | Qty: ${item.quantity}
                                          </p>
                                        </div>
                                        <p class="font-medium">${formatCurrency(
                                          item.price * item.quantity
                                        )}</p>
                                      </div>
                                    `
                                      )
                                      .join('')}
                                    <div class="border-t pt-4 space-y-2">
                                      <div class="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>${formatCurrency(
                                          order.total_amount -
                                            (order.shipping_cost || 0) -
                                            (order.tax_amount || 0)
                                        )}</span>
                                      </div>
                                      <div class="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span>${formatCurrency(
                                          order.shipping_cost || 0
                                        )}</span>
                                      </div>
                                      <div class="flex justify-between text-sm">
                                        <span>Tax</span>
                                        <span>${formatCurrency(
                                          order.tax_amount || 0
                                        )}</span>
                                      </div>
                                      <div class="flex justify-between font-bold pt-2">
                                        <span>Total</span>
                                        <span>${formatCurrency(
                                          order.total_amount
                                        )}</span>
                                      </div>
                                    </div>
                                    ${
                                      order.delivery_address
                                        ? `
                                      <div class="mt-4 pt-4 border-t">
                                        <h3 class="font-medium mb-2">Delivery Address</h3>
                                        <p class="text-sm text-gray-600">
                                          ${order.delivery_address.street}<br>
                                          ${order.delivery_address.city}, ${order.delivery_address.state} ${order.delivery_address.zip}
                                        </p>
                                      </div>
                                    `
                                        : ''
                                    }
                                  </div>
                                  <button
                                    class="mt-6 w-full bg-primary-900 text-white py-2 rounded hover:bg-primary-800"
                                    onclick="this.closest('.fixed').remove()"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            `;
                            document.body.appendChild(modal);
                          }}
                          className="text-accent-600 hover:text-accent-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
