import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import ProductCard from '../components/ui/ProductCard';

const WishlistPage: React.FC = () => {
  const { items } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">My Wishlist</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={64} className="mx-auto text-primary-300 mb-6" />
          <h2 className="text-2xl font-medium text-primary-800 mb-4">Your wishlist is empty</h2>
          <p className="text-primary-600">
            Save items you love by clicking the heart icon on any product.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;