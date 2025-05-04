import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  X,
  ChevronRight,
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, fetchProducts } = useProductStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProduct();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find((p) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0] || '');
        setSelectedSize(foundProduct.sizes[0] || '');
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-mono text-gray-700">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4 font-mono">
          Product Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 font-mono">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const allImages = [
    product.image_url,
    ...(product.additional_images || []),
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveImageIndex((prev) =>
        prev > 0 ? prev - 1 : allImages.length - 1
      );
    } else {
      setActiveImageIndex((prev) =>
        prev < allImages.length - 1 ? prev + 1 : 0
      );
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm font-mono text-gray-600">
          <li>
            <Link to="/" className="hover:text-gray-900">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link to="/products" className="hover:text-gray-900">
              Products
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link
              to={`/products/${product.category}`}
              className="hover:text-gray-900"
            >
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-500 truncate max-w-[150px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`block w-full aspect-square border rounded overflow-hidden ${
                    activeImageIndex === index
                      ? 'ring-2 ring-accent-500'
                      : 'ring-1 ring-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            <div
              className="col-span-3 rounded-lg overflow-hidden border border-gray-200 relative cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={allImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
                  Click to zoom
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-700 mb-2 font-mono">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-gray-700 mb-6 font-mono">
            {formatCurrency(product.price)}
          </p>

          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-2 font-mono">
              Description
            </h2>
            <p className="text-gray-600 font-mono">{product.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-2 font-mono">
              Color: {selectedColor}
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full ${
                    selectedColor === color
                      ? 'ring-2 ring-accent-500 ring-offset-2'
                      : 'ring-1 ring-gray-300'
                  }`}
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
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-700 font-mono">
                Size: {selectedSize}
              </h2>
              <button className="text-sm text-accent-600 hover:text-accent-700 font-mono">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md text-sm font-mono ${
                    selectedSize === size
                      ? 'bg-primary-900 text-white border-primary-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 mb-2 font-mono">
              Quantity
            </h2>
            <div className="flex items-center border border-gray-300 rounded-md w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 font-mono"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full text-center border-0 focus:ring-0 font-mono"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 font-mono"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              fullWidth
              size="lg"
              variant="primary"
              leftIcon={<ShoppingCart size={20} />}
              disabled={!product.in_stock}
              className="font-mono"
            >
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              fullWidth
              size="lg"
              variant={isWishlisted ? 'primary' : 'outline'}
              leftIcon={
                <Heart
                  size={20}
                  className={isWishlisted ? 'fill-current' : ''}
                />
              }
              onClick={toggleWishlist}
              className="font-mono"
            >
              {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck size={20} className="text-gray-600 mr-2" />
                <span className="text-sm text-gray-600 font-mono">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center">
                <RotateCcw size={20} className="text-gray-600 mr-2" />
                <span className="text-sm text-gray-600 font-mono">
                  30 Days Return
                </span>
              </div>
              <div className="flex items-center">
                <Shield size={20} className="text-gray-600 mr-2" />
                <span className="text-sm text-gray-600 font-mono">
                  2 Year Warranty
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <Share2 size={18} className="text-gray-600 mr-2" />
            <span className="text-sm text-gray-600 font-mono">
              Share this product
            </span>
          </div>
        </div>
      </div>

      {/* image modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <ChevronLeft size={36} />
            </button>

            <img
              src={allImages[activeImageIndex]}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <ChevronRight size={36} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
