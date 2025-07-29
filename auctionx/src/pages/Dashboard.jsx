import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Package, Wallet, Bell, ChevronDown, 
  Search, Gavel, Heart, Clock, BarChart3, Calendar,
  CreditCard, MessageSquare, Award, TrendingUp,
  Edit3, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/details', {
          withCredentials: true
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/user/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userStats = [
    { label: 'Active Bids', value: '12', icon: Gavel, trend: '+2.4%' },
    { label: 'Won Auctions', value: '8', icon: Award, trend: '+5.1%' },
    { label: 'Watch List', value: '24', icon: Heart, trend: '+1.2%' },
    { label: 'Total Spent', value: '$2.4k', icon: Wallet, trend: '+8.4%' }
  ];

  const upcomingAuctions = [
    {
      title: 'Vintage Rolex Daytona',
      time: '2h 15m',
      currentBid: '$15,250',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400',
      bids: 23
    },
    {
      title: 'Modern Art Collection',
      time: '5h 30m',
      currentBid: '$8,800',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
      bids: 15
    }
  ];

  const recentActivity = [
    { 
      action: 'Bid placed', 
      item: 'Antique Vase', 
      amount: '$450', 
      time: '2 hours ago',
      status: 'success'
    },
    { 
      action: 'Won auction', 
      item: 'Vintage Camera', 
      amount: '$890', 
      time: '1 day ago',
      status: 'success'
    },
    { 
      action: 'Outbid', 
      item: 'Art Deco Lamp', 
      amount: '$320', 
      time: '2 days ago',
      status: 'warning'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <Gavel className="h-8 w-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  AuctionX
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search auctions..."
                  className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <img
                    src={profileData.profileImage ? `data:image/jpeg;base64,${profileData.profileImage}` : '/default-profile.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      {profileData.name}
                    </p>
                    <p className="text-xs text-gray-500">Premium Member</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-300 origin-top-right">
                    <div className="p-4 border-b">
                      <p className="text-sm font-medium text-gray-900">{profileData.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{profileData.location}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3 text-purple-600" />
                        Profile
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Link>
                      <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors">
                        <Settings className="h-4 w-4 mr-3 text-purple-600" />
                        Settings
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search auctions..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <Link
                to="/profile"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <User className="h-5 w-5 mr-3 text-purple-600" />
                Profile
              </Link>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5 mr-3 text-purple-600" />
                Settings
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Grid */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <span className="text-xs">▲</span> {stat.trend}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-600 group-hover:rotate-12 transition-all duration-300">
                      <stat.icon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="md:col-span-2 space-y-6">
              {/* Bidding Activity Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Bidding Activity</h3>
                  <select className="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-32 w-32" />
                </div>
              </div>

              {/* Upcoming Auctions */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Auctions</h3>
                <div className="space-y-4">
                  {upcomingAuctions.map((auction, index) => (
                    <div key={index} className="group flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all duration-300">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {auction.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> {auction.time}
                          </span>
                          <span className="flex items-center">
                            <Wallet className="h-4 w-4 mr-1" /> {auction.currentBid}
                          </span>
                          <span className="flex items-center">
                            <Gavel className="h-4 w-4 mr-1" /> {auction.bids} bids
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300">
                        Bid Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Package, label: 'List Item' },
                    { icon: CreditCard, label: 'Add Funds' },
                    { icon: MessageSquare, label: 'Support' },
                    { icon: TrendingUp, label: 'Analytics' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="p-4 text-center bg-gray-50 rounded-xl hover:bg-purple-50 group transition-all duration-300"
                    >
                      <action.icon className="h-6 w-6 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium group-hover:text-purple-600 transition-colors">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        activity.status === 'success' ? 'bg-green-100 group-hover:bg-green-200' : 'bg-yellow-100 group-hover:bg-yellow-200'
                      }`}>
                        <Gavel className={`h-4 w-4 ${
                          activity.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {activity.action} on {activity.item}
                        </p>
                        <p className="text-sm text-gray-500">{activity.amount} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Luxury Watch Auction', time: 'Tomorrow, 2:00 PM', highlight: true },
                    { title: 'Art Collection Preview', time: 'Sep 25, 11:00 AM', highlight: false }
                  ].map((event, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        event.highlight
                          ? 'bg-purple-50 hover:bg-purple-100'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className={`text-sm font-medium ${
                        event.highlight ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </p>
                      <p className={`text-xs ${
                        event.highlight ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {event.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;