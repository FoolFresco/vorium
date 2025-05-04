import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
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
import { formatCurrency } from '../../lib/utils';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { Database } from '../../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuthStore();
  const {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [isAdmin, navigate, fetchProducts]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      image_url: formData.get('image_url') as string,
      additional_images: formData.get('additional_images')
        ? (formData.get('additional_images') as string)
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
        : [],
      colors: (formData.get('colors') as string)
        .split(',')
        .map((c) => c.trim()),
      sizes: (formData.get('sizes') as string).split(',').map((s) => s.trim()),
      in_stock: formData.get('in_stock') === 'on',
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      setEditingProduct(null);
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="flex-1 pl-64 p-8 font-mono text-gray-700">
        Loading products...
      </div>
    );
  }

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
              className="flex items-center py-2 px-4 rounded-md transition-colors bg-primary-100 text-primary-900"
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
            <h1 className="text-2xl font-bold text-gray-700 font-mono">
              Product Management
            </h1>
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingProduct(null);
              }}
              leftIcon={<Plus size={18} />}
              className="font-mono"
            >
              Add Product
            </Button>
          </div>

          {(showAddForm || editingProduct) && (
            <div className="bg-white rounded-lg shadow mb-8 p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-6 font-mono">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <Input
                  label="Product Name"
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                  fullWidth
                  className="font-mono"
                />
                <Input
                  label="Price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct?.price}
                  required
                  fullWidth
                  className="font-mono"
                />
                <div className="col-span-2">
                  <Input
                    label="Description"
                    name="description"
                    defaultValue={editingProduct?.description || ''}
                    required
                    fullWidth
                    className="font-mono"
                  />
                </div>
                <Input
                  label="Category"
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                  fullWidth
                  className="font-mono"
                />
                <Input
                  label="Main Image URL"
                  name="image_url"
                  defaultValue={editingProduct?.image_url || ''}
                  required
                  fullWidth
                  className="font-mono"
                />
                <div className="col-span-2">
                  <Input
                    label="Additional Images (comma-separated URLs)"
                    name="additional_images"
                    defaultValue={
                      editingProduct?.additional_images?.join(', ') || ''
                    }
                    fullWidth
                    className="font-mono"
                  />
                </div>
                <Input
                  label="Colors (comma-separated)"
                  name="colors"
                  defaultValue={editingProduct?.colors?.join(', ') || ''}
                  required
                  fullWidth
                  className="font-mono"
                />
                <Input
                  label="Sizes (comma-separated)"
                  name="sizes"
                  defaultValue={editingProduct?.sizes?.join(', ') || ''}
                  required
                  fullWidth
                  className="font-mono"
                />
                <div className="col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="in_stock"
                      defaultChecked={
                        editingProduct ? editingProduct.in_stock : true
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 font-mono">
                      In Stock
                    </span>
                  </label>
                </div>
                <div className="col-span-2 flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                    }}
                    className="font-mono"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="font-mono">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={product.image_url || ''}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-700 font-mono">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              ID: {product.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold font-mono">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full font-mono ${
                            product.in_stock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowAddForm(false);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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

export default ProductsPage;
