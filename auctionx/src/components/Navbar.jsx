import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gavel,
  ChevronDown,
  Search,
  Menu,
  X,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  MessageSquare,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import AuthModal from '../pages/auth';
import WelcomePopup from './WelcomePopup';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const checkAuthStatus = async (retries = 3) => {
    try {
      const response = await axios.get('http://localhost:8080/user/details', {
        withCredentials: true
      });
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      if (error.response) {
        console.error('Not authenticated');
      } else if (error.request) {
        if (retries > 0) {
          console.warn(`Retrying... (${3 - retries + 1})`);
          setTimeout(() => checkAuthStatus(retries - 1), 1000);
        } else {
          console.error('Connection refused. Please check if the backend server is running.');
        }
      } else {
        console.error('An error occurred:', error.message);
      }
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/user/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      localStorage.removeItem('user');
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    setShowWelcomePopup(true);
  };

  const categories = [
    {
      name: 'Art & Collectibles',
      subcategories: [
        { name: 'Fine Art', items: ['Paintings', 'Sculptures', 'Prints'] },
        { name: 'Collectibles', items: ['Sports', 'Trading Cards', 'Stamps'] },
        { name: 'Antiques', items: ['Furniture', 'Jewelry', 'Ceramics'] }
      ]
    },
    {
      name: 'Vehicles',
      subcategories: [
        { name: 'Cars', items: ['Classic', 'Luxury', 'Sports'] },
        { name: 'Motorcycles', items: ['Vintage', 'Custom', 'Sport Bikes'] },
        { name: 'Boats', items: ['Yachts', 'Sailboats', 'Speed Boats'] }
      ]
    },
    {
      name: 'Real Estate',
      subcategories: [
        { name: 'Residential', items: ['Houses', 'Apartments', 'Villas'] },
        { name: 'Commercial', items: ['Offices', 'Retail', 'Industrial'] },
        { name: 'Land', items: ['Development', 'Agricultural', 'Residential Lots'] }
      ]
    }
  ];

  const userMenuItems = [
    { icon: User, label: 'View Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: CreditCard, label: 'Subscription', path: '/subscription' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Dashboard', path: '/dashboard' }
  ];

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (categoryName) => {
    setActiveDropdown(activeDropdown === categoryName ? null : categoryName);
  };

  const UserDropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : '/default-profile.png'}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {userMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            onClick={() => setIsProfileDropdownOpen(false)}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="py-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const renderAuthButtons = () => {
    if (isLoading) {
      return null; // Show nothing while loading
    }

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : '/default-profile.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700">{user.name}</span>
              <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
                isProfileDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {isProfileDropdownOpen && <UserDropdownMenu />}
          </div>
        </div>
      );
    }

    return (
      <>
        <button
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 rounded-full text-purple-600 hover:text-purple-700 transition-colors hover:bg-purple-50"
        >
          Sign in
        </button>
        <button
          onClick={() => openAuthModal('signup')}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 transform hover:scale-[1.02] transition-all duration-300"
        >
          Sign up
        </button>
      </>
    );
  };

  const renderMobileMenu = () => (
    <div className="fixed inset-0 top-16 bg-white z-50 overflow-y-auto lg:hidden">
      <div className="px-4 py-6 space-y-6">
        {user && (
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : '/default-profile.png'}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            {userMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Search auctions..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Categories */}
        {categories.map((category) => (
          <div key={category.name} className="space-y-4">
            <button
              onClick={() => toggleDropdown(category.name)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-lg font-semibold text-gray-900">{category.name}</span>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                activeDropdown === category.name ? 'rotate-180' : ''
              }`} />
            </button>
            
            <div className={`space-y-4 transition-all duration-300 ease-in-out ${
              activeDropdown === category.name ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.name} className="pl-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {subcategory.name}
                  </h3>
                  <ul className="space-y-2">
                    {subcategory.items.map((item) => (
                      <li key={item}>
                        <Link
                          to={`/category/${item.toLowerCase()}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-gray-600 hover:text-purple-600 transition-colors block py-1"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                to={`/categories/${category.name.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block pl-4 text-sm font-medium text-purple-600 hover:text-purple-700 py-2"
              >
                Browse all {category.name} →
              </Link>
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-gray-700 hover:text-purple-600"
          >
            About
          </Link>
          <Link
            to="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-gray-700 hover:text-purple-600"
          >
            Blog
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <Gavel className="h-8 w-8 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                AuctionX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(category.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button 
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors py-2"
                  >
                    <span>{category.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === category.name ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {activeDropdown === category.name && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[42rem] bg-white rounded-xl shadow-xl ring-1 ring-black/5 transition-all duration-200 transform opacity-100 scale-100">
                      <div className="grid grid-cols-3 gap-x-8 gap-y-6 p-8">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.name} className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {subcategory.name}
                            </h3>
                            <ul className="space-y-2">
                              {subcategory.items.map((item) => (
                                <li key={item}>
                                  <Link
                                    to={`/category/${item.toLowerCase()}`}
                                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-8 py-4 rounded-b-xl">
                        <Link
                          to={`/categories/${category.name.toLowerCase()}`}
                          className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center space-x-1 group"
                        >
                          <span>Browse all {category.name}</span>
                          <ChevronDown className="h-4 w-4 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
                About
              </Link>
              
              <Link to="/blog" className="text-gray-700 hover:text-purple-600 transition-colors">
                Blog
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search auctions..."
                  className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 group-hover:text-purple-500 transition-colors" />
              </div>

              {renderAuthButtons()}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              {user ? (
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="relative"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 text-sm text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-all duration-300"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Sign up
                  </button>
                </>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && renderMobileMenu()}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {showWelcomePopup && (
        <WelcomePopup
          user={user}
          onClose={() => setShowWelcomePopup(false)}
        />
      )}
    </>
  );
};

export default Navbar;

