import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const location = useLocation();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks for subscribing with: ${email}`);
    setEmail('');
  };

  // убрать подписку на почту в админ панели
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <footer
      className={
        isAdminRoute ? 'bg-white text-primary-900' : 'bg-primary-900 text-white'
      }
    >
      {!isAdminRoute && (
        <div className="bg-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Join Our Newsletter
              </h2>
              <p className="mb-6 text-gray-400">
                Subscribe to receive updates, access to exclusive deals, and
                more.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md text-primary-900 focus:ring-accent-500 focus:border-accent-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-accent-600 hover:bg-accent-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* main footer */}
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About VORIUM</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/sustainability"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={
                    isAdminRoute
                      ? 'text-primary-600 hover:text-primary-900 transition-colors'
                      : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isAdminRoute
                    ? 'text-primary-600 hover:text-primary-900 transition-colors'
                    : 'text-gray-300 hover:text-white transition-colors'
                }
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isAdminRoute
                    ? 'text-primary-600 hover:text-primary-900 transition-colors'
                    : 'text-gray-300 hover:text-white transition-colors'
                }
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isAdminRoute
                    ? 'text-primary-600 hover:text-primary-900 transition-colors'
                    : 'text-gray-300 hover:text-white transition-colors'
                }
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div
          className={`border-t ${
            isAdminRoute ? 'border-gray-200' : 'border-gray-800'
          } mt-10 pt-8 flex flex-col md:flex-row justify-between items-center`}
        >
          <p
            className={
              isAdminRoute
                ? 'text-primary-600 text-sm'
                : 'text-gray-400 text-sm'
            }
          >
            &copy; {new Date().getFullYear()} VORIUM. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy-policy"
              className={
                isAdminRoute
                  ? 'text-primary-600 hover:text-primary-900 text-sm transition-colors'
                  : 'text-gray-400 hover:text-white text-sm transition-colors'
              }
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className={
                isAdminRoute
                  ? 'text-primary-600 hover:text-primary-900 text-sm transition-colors'
                  : 'text-gray-400 hover:text-white text-sm transition-colors'
              }
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
