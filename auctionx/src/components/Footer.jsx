import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gavel, 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react';

function Footer() {
  const quickLinks = ['Home', 'Auctions', 'How It Works', 'About Us'];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <Gavel className="h-8 w-8 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                AuctionX
              </span>
            </Link>
            <p className="text-gray-300 text-sm">
              Your trusted platform for premium auctions. Discover unique items and bid with confidence.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' }
              ].map(({ Icon, href }, index) => (
                <a 
                  key={index}
                  href={href}
                  className="text-gray-400 hover:text-primary-600 transform hover:scale-110 transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link 
                    to="/" 
                    className="text-gray-300 hover:text-primary-600 flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span className="group-hover:translate-x-2 transition-transform">
                      {link}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {[
                { Icon: Phone, text: '+91 9121347377' },
                { Icon: Mail, text: 'ssaleem2409@gmail.com' },
                { Icon: MapPin, text: 'KL UNIVERSITY' }
              ].map(({ Icon, text }, index) => (
                <li key={index} className="flex items-center space-x-3 group">
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  <span className="text-gray-300 group-hover:text-primary-600 transition-colors">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get updates on new auctions and exclusive offers.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transform hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} AuctionX. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link
                  key={item}
                  to="/"
                  className="text-gray-400 hover:text-primary-600 text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;