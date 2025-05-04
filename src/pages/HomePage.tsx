import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { useProductStore } from '../store/productStore';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

const HomePage: React.FC = () => {
  const { fetchFeaturedProducts } = useProductStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const products = await fetchFeaturedProducts();
      setFeaturedProducts(products);
      setLoading(false);
    };
    loadFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="animate-fade-in">
      {/* banner */}
      <div className="relative">
        <div className="h-[60vh] md:h-[80vh] bg-gray-900 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMGFlc3RoZXRpY3xlbnwwfHwwfHx8MA%3D%3D"
            alt="Fashion model in stylish clothing"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-16 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Elevate Your Style
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
              Discover our latest collection of premium clothing designed for
              comfort and elegance.
            </p>
            <Link to="/products">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* shop by category */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* T-Shirts */}
          <Link
            to="/products/tshirts"
            className="relative group overflow-hidden rounded-lg shadow-md h-80"
          >
            <img
              src="https://static.zara.net/assets/public/9c7a/1269/a7d64f779397/03a9552d3416/00761450427-e1/00761450427-e1.jpg?ts=1735549640381&w=750"
              alt="T-Shirts"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">T-Shirts</h3>
              <span className="inline-block bg-white text-primary-900 px-3 py-1 rounded-full text-sm font-medium">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Hoodies */}
          <Link
            to="/products/hoodies"
            className="relative group overflow-hidden rounded-lg shadow-md h-80"
          >
            <img
              src="https://static.zara.net/assets/public/7b71/b89a/1dbb43cc8ba8/ae68c70f4852/04729402898-e1/04729402898-e1.jpg?ts=1742224740470&w=750"
              alt="Hoodies"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Hoodies</h3>
              <span className="inline-block bg-white text-primary-900 px-3 py-1 rounded-full text-sm font-medium">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Bottoms */}
          <Link
            to="/products/bottoms"
            className="relative group overflow-hidden rounded-lg shadow-md h-80"
          >
            <img
              src="https://static.zara.net/assets/public/48aa/fe9b/7c804175995a/23be122ec898/01538478500-e1/01538478500-e1.jpg?ts=1743434233063&w=750"
              alt="Bottoms"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Bottoms</h3>
              <span className="inline-block bg-white text-primary-900 px-3 py-1 rounded-full text-sm font-medium">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Accessories */}
          <Link
            to="/products/accessories"
            className="relative group overflow-hidden rounded-lg shadow-md h-80"
          >
            <img
              src="https://i.imgur.com/rq5PdwX.jpeg"
              alt="Accessories"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Accessories</h3>
              <span className="inline-block bg-white text-primary-900 px-3 py-1 rounded-full text-sm font-medium">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-accent-600 hover:text-accent-700 font-medium flex items-center"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* promo banner */}
      <div className="bg-primary-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">New Season, New Style</h2>
            <p className="text-gray-300 max-w-lg">
              Refresh your wardrobe with our latest arrivals. Use code NEWSEASON
              for 10% off your first order.
            </p>
          </div>
          <Link to="/products">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-900"
            >
              Shop New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
