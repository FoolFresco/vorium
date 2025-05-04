import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  ShoppingCart,
  Package,
  BarChart4,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { useOrderStore } from '../../store/orderStore';
import { formatCurrency } from '../../lib/utils';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAuthStore();
  const { products } = useProductStore();
  const { orders } = useOrderStore();

  // редирект если не админ
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // извлечь данные
  React.useEffect(() => {
    if (isAdmin) {
      useProductStore.getState().fetchProducts();
      useOrderStore.getState().fetchOrders();
    }
  }, [isAdmin]);

  // stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* sidebar */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-0 bottom-0 overflow-y-auto z-50">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>

          <nav className="space-y-2">
            <Link
              to="/admin"
              className={`flex items-center py-2 px-4 rounded-md transition-colors ${
                isActivePath('/admin')
                  ? 'bg-primary-100 text-primary-900'
                  : 'hover:bg-primary-50'
              }`}
            >
              <BarChart4 size={20} className="mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center py-2 px-4 rounded-md transition-colors ${
                isActivePath('/admin/products')
                  ? 'bg-primary-100 text-primary-900'
                  : 'hover:bg-primary-50'
              }`}
            >
              <ShoppingBag size={20} className="mr-3" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className={`flex items-center py-2 px-4 rounded-md transition-colors ${
                isActivePath('/admin/orders')
                  ? 'bg-primary-100 text-primary-900'
                  : 'hover:bg-primary-50'
              }`}
            >
              <ShoppingCart size={20} className="mr-3" />
              Orders
            </Link>
            <Link
              to="/admin/settings"
              className={`flex items-center py-2 px-4 rounded-md transition-colors ${
                isActivePath('/admin/settings')
                  ? 'bg-primary-100 text-primary-900'
                  : 'hover:bg-primary-50'
              }`}
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

      {/* отступ слева */}
      <div className="flex-1 pl-64">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

          {/* stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-primary-100 p-3 rounded-lg mr-4">
                  <ShoppingBag size={24} className="text-primary-900" />
                </div>
                <div>
                  <p className="text-sm text-primary-600">Total Products</p>
                  <h3 className="text-2xl font-bold text-primary-900">
                    {totalProducts}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <ShoppingCart size={24} className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-primary-600">Total Orders</p>
                  <h3 className="text-2xl font-bold text-primary-900">
                    {totalOrders}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <BarChart4 size={24} className="text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm text-primary-600">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-primary-900">
                    {formatCurrency(totalRevenue)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* recent */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
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
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipped'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-accent-600 hover:text-accent-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* low stock */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Low Stock Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Price
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
                  {products
                    .filter((p) => !p.in_stock)
                    .slice(0, 5)
                    .map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={product.image_url}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-primary-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-primary-500">
                                ID: #{product.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                          {product.category.charAt(0).toUpperCase() +
                            product.category.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                          <Link
                            to={`/admin/products`}
                            className="text-accent-600 hover:text-accent-900"
                          >
                            Edit Product
                          </Link>
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

export default AdminDashboard;
