import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ui/ProductCard';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const location = useLocation();

  const { getProductsByCategory, searchProducts } = useProductStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // фикс скролла
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts;
        if (searchQuery) {
          fetchedProducts = await searchProducts(searchQuery);
        } else if (category) {
          fetchedProducts = await getProductsByCategory(category);
        } else {
          fetchedProducts = await getProductsByCategory(null);
        }
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, getProductsByCategory, searchProducts]);

  // category ttitle
  const getTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (!category) return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">
          {getTitle()}
        </h1>
        <div className="text-center py-16">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">{getTitle()}</h1>

      {/* grid */}
      <div className="flex-1">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-primary-800 mb-4">
              No products found
            </h2>
            <p className="text-primary-600">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
