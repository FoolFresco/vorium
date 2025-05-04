import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useWishlistStore } from '../../store/wishlistStore';
import type { Database } from '../../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();

  // гet the first two images rollback to the same image if a second not available
  const primaryImage = product.image_url || '';
  const secondaryImage = product.additional_images?.[0] || primaryImage;

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <div
      className="group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {!product.in_stock && (
          <div className="absolute top-2 right-2 bg-primary-900 text-white text-xs font-bold px-2 py-1 rounded font-mono">
            Out of Stock
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 left-2 p-2 rounded-full ${
            isWishlisted
              ? 'bg-accent-600 text-white'
              : 'bg-white text-gray-600 hover:text-accent-600'
          } transition-colors duration-200 shadow-md`}
        >
          <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-700 hover:text-accent-600 transition-colors font-mono">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-gray-600 font-bold font-mono">
          {formatCurrency(product.price)}
        </p>
        <div className="mt-2 flex items-center space-x-2">
          {product.colors.slice(0, 3).map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{
                backgroundColor:
                  color.toLowerCase() === 'white'
                    ? '#ffffff'
                    : color.toLowerCase() === 'black'
                    ? '#000000'
                    : color.toLowerCase() === 'gray'
                    ? '#808080'
                    : color.toLowerCase() === 'navy'
                    ? '#000080'
                    : color.toLowerCase() === 'blue'
                    ? '#0000ff'
                    : color.toLowerCase() === 'khaki'
                    ? '#f0e68c'
                    : color.toLowerCase() === 'olive'
                    ? '#808000'
                    : color.toLowerCase() === 'brown'
                    ? '#a52a2a'
                    : color.toLowerCase() === 'silver'
                    ? '#c0c0c0'
                    : color.toLowerCase() === 'gold'
                    ? '#ffd700'
                    : '#ffffff',
              }}
              title={color}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-xs text-gray-500 font-mono">
              +{product.colors.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
