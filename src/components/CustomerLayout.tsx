import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Smartphone, Home, Search, Grid, X, Clock, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';
import { AnimatePresence, motion } from 'motion/react';

export function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, products } = useData();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const mobileNavItems = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'Categories', path: '/categories', icon: Grid },
    { title: 'Offers', path: '/offers', icon: Tag },
    { title: 'Profile', path: '/profile', icon: User },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock recent searches
  const recentSearches = ['iPhone 15', 'Samsung S24', 'AirPods', 'Charger'];

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const closeSearch = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header 
        className={cn(
          "border-b border-gray-200 sticky top-0 bg-white z-50 transition-shadow duration-200",
          isScrolled ? "shadow-md" : ""
        )}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          {/* Left: Logo */}
          <Link 
            to="/" 
            className={cn(
              "flex items-center transition-opacity duration-200",
              isSearchExpanded ? "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto" : "opacity-100"
            )}
          >
            <img src="/logo.png" alt="Gunjan Telecom" className="h-9 w-9 object-contain" />
            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block ml-2">Gunjan Telecom</span>
          </Link>

          {/* Center: Search Bar */}
          <div 
            ref={searchContainerRef}
            className={cn(
              "absolute md:relative left-0 right-0 px-4 md:px-0 flex-1 flex justify-center transition-all duration-300 ease-in-out",
              isSearchExpanded ? "z-50 top-2 md:top-auto opacity-100" : "top-2 md:top-auto opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
            )}
          >
            <div className={cn(
              "relative w-full transition-all duration-300",
              isSearchExpanded ? "max-w-full" : "max-w-md"
            )}>
              <div className="relative flex items-center w-full h-12 md:h-10 rounded-full focus-within:shadow-lg bg-gray-100 overflow-hidden border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-colors">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  ref={searchInputRef}
                  className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
                  type="text"
                  id="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                />
                {isSearchExpanded && (
                  <button 
                    onClick={closeSearch}
                    className="grid place-items-center h-full w-12 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Search Overlay */}
              {isSearchExpanded && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                  <div className="p-4">
                    {searchQuery ? (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Suggested Products</h3>
                        {filteredProducts.length > 0 ? (
                          <ul className="space-y-2">
                            {filteredProducts.map(product => (
                              <li key={product.id}>
                                <Link 
                                  to={`/product/${product.id}`}
                                  onClick={closeSearch}
                                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500">৳{product.price.toFixed(2)}</p>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 py-2">No products found for "{searchQuery}"</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Searches</h3>
                        <ul className="space-y-2">
                          {recentSearches.map((search, idx) => (
                            <li key={idx}>
                              <button 
                                onClick={() => {
                                  setSearchQuery(search);
                                  searchInputRef.current?.focus();
                                }}
                                className="flex items-center w-full p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                              >
                                <Clock className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="text-sm text-gray-700">{search}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className={cn(
            "flex items-center space-x-2 sm:space-x-4 transition-opacity duration-200",
            isSearchExpanded ? "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto" : "opacity-100"
          )}>
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
              onClick={handleSearchClick}
            >
              <Search className="h-6 w-6" />
            </button>
            <Link to="/cart" className="text-gray-600 hover:text-indigo-600 relative p-2">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Mobile Search Overlay Backdrop */}
        {isSearchExpanded && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-40 top-16"
            onClick={closeSearch}
          />
        )}
      </header>
      <main className="flex-grow pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="bg-gray-900 text-white py-12 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2026 Gunjan Telecom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
