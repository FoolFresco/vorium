import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { getTotalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, isAdmin, logout } = useAuthStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* логотип */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary-900 font-courier">
              VORIUM
            </h1>
          </Link>

          {/* навигация */}
          <nav className="hidden md:flex space-x-8 mr-auto ml-8">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium"
            >
              All
            </Link>
            <Link
              to="/products/tshirts"
              className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium"
            >
              T-Shirts and Tops
            </Link>
            <Link
              to="/products/hoodies"
              className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium"
            >
              Hoodies
            </Link>
            <Link
              to="/products/bottoms"
              className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium"
            >
              Bottoms
            </Link>
            <Link
              to="/products/jewelry"
              className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium"
            >
              Jewelry
            </Link>
            <Link
              to="/products/accessories"
              className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium"
            >
              Accessories
            </Link>
          </nav>

          {/* иконки справа */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="text-primary-600 hover:text-primary-900 focus:outline-none"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              to="/cart"
              className="text-primary-600 hover:text-primary-900 relative"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-primary-600 hover:text-primary-900 focus:outline-none flex items-center"
                  aria-label="User menu"
                >
                  <User size={20} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        My Account
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart size={16} className="mr-3" />
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Heart size={16} className="mr-3" />
                        Wishlist
                        {wishlistItems.length > 0 && (
                          <span className="ml-auto bg-accent-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User size={16} className="mr-3" />
                          Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <X size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-900 hidden md:block"
              >
                <User size={20} />
              </Link>
            )}

            {/* мобильное меню */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-primary-600 hover:text-primary-900 focus:outline-none"
              aria-label="Main menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* поиск */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/5 backdrop-blur-sm"
              onClick={toggleSearch}
            />
            <div className="relative w-full bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center py-4"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent placeholder-gray-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                    {wishlistItems.length > 0 && (
                      <span className="ml-2 bg-accent-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-200 my-2" />
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/products"
                className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                All
              </Link>
              <Link
                to="/products/tshirts"
                className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                T-Shirts
              </Link>
              <Link
                to="/products/hoodies"
                className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Hoodies
              </Link>
              <Link
                to="/products/bottoms"
                className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Bottoms
              </Link>
              <Link
                to="/products/jewelry"
                className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Jewelry
              </Link>
              <Link
                to="/products/accessories"
                className="block px-3 py-2 text-base font-medium text-primary-900 hover:bg-primary-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-primary-100 rounded-md"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;