import React, { useEffect } from 'react';
import { X, PartyPopper } from 'lucide-react';

const WelcomePopup = ({ user, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full border border-purple-100 transform transition-all">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-300"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-center justify-center mb-4">
          <PartyPopper className="h-8 w-8 text-purple-600 animate-bounce" />
        </div>
        
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h3>
        <p className="text-center text-gray-600">
          We're excited to have you back at AuctionX. Happy bidding!
        </p>
      </div>
    </div>
  );
};

export default WelcomePopup;