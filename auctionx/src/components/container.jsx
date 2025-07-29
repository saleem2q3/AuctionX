import React from 'react';
import { ArrowRight } from 'lucide-react';

const MarketAnalysis = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Market <span className="text-gray-400">Analysis</span></h2>
            <p className="text-gray-600 mb-8">Stay ahead of market trends with our comprehensive analysis tools and insights.</p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-600">
                <ArrowRight className="h-5 w-5 text-purple-600 mr-2" />
                Real-time market data and trends
              </li>
              <li className="flex items-center text-gray-600">
                <ArrowRight className="h-5 w-5 text-purple-600 mr-2" />
                Competitor price analysis
              </li>
              <li className="flex items-center text-gray-600">
                <ArrowRight className="h-5 w-5 text-purple-600 mr-2" />
                Demand forecasting
              </li>
            </ul>
            <button className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Learn More
            </button>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Latest Market Insights</h3>
            <p className="text-gray-600 mb-4">
              Our advanced analytics provide you with actionable insights to optimize your selling strategy and maximize profits.
            </p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-semibold">Trending Categories</h4>
                <p className="text-gray-600">Discover what's hot in the market right now</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-semibold">Price Optimization</h4>
                <p className="text-gray-600">Set competitive prices based on market data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About AuctionX</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                AuctionX is revolutionizing the way people buy and sell unique items. Our platform 
                brings together collectors, enthusiasts, and sellers from around the world, creating 
                a vibrant marketplace for extraordinary finds.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$10M+</div>
                  <div className="text-gray-600">Items Sold</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                  <div className="text-gray-600">Secure Transactions</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1559762717-99c81ac85459?auto=format&fit=crop&q=80&w=600"
                  alt="Auction"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&q=80&w=600"
                  alt="Auction"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketAnalysis;