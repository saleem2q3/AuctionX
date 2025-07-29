import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Gavel,
  X,
  Award,
  Clock,
  ShoppingBag,
  Heart
} from 'lucide-react';
import axios from 'axios';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-purple-50 rounded-lg">
        <Icon className="h-5 w-5 text-purple-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phno: ''
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState({
    profile: null,
    cover: null
  });
  const [selectedFiles, setSelectedFiles] = useState({
    profileImage: null,
    coverImage: null
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/details', {
        withCredentials: true
      });
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        username: response.data.username || '',
        email: response.data.email || '',
        password: '',
        phno: response.data.phno || ''
      });
      setPreviewImages({
        profile: response.data.profileImage ? `data:image/jpeg;base64,${response.data.profileImage}` : null,
        cover: response.data.coverImage ? `data:image/jpeg;base64,${response.data.coverImage}` : null
      });
    } catch (error) {
      showNotification('error', 'Failed to fetch user details');
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);

      setSelectedFiles(prev => ({
        ...prev,
        [type === 'profile' ? 'profileImage' : 'coverImage']: file
      }));
    }
  };

  const removeImage = (type) => {
    setPreviewImages(prev => ({
      ...prev,
      [type]: null
    }));
    setSelectedFiles(prev => ({
      ...prev,
      [type === 'profile' ? 'profileImage' : 'coverImage']: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.phno && !/^\d{10}$/.test(formData.phno)) {
      newErrors.phno = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key] !== user[key] && key !== 'email') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedFiles.profileImage) {
        formDataToSend.append('profileImage', selectedFiles.profileImage);
      }
      if (selectedFiles.coverImage) {
        formDataToSend.append('coverImage', selectedFiles.coverImage);
      }

      if ([...formDataToSend.entries()].length === 0) {
        showNotification('error', 'No changes to update');
        setIsLoading(false);
        return;
      }

      const response = await axios.put('http://localhost:8080/user/update', 
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      await fetchUserDetails();
      setIsEditing(false);
      showNotification('success', 'Profile updated successfully');
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to update profile';
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const FormError = ({ message }) => (
    <p className="mt-1 text-sm text-red-600">{message}</p>
  );

  const CoverImageSection = ({ preview, onImageChange, onRemove }) => (
    <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500">
      {preview ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity opacity-0 hover:opacity-100">
            {isEditing && (
              <div className="absolute top-4 right-4 flex space-x-2">
                <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera className="h-5 w-5 text-gray-700" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => onImageChange(e, 'cover')}
                  />
                </label>
                <button
                  onClick={() => onRemove('cover')}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isEditing ? (
            <label className="flex flex-col items-center cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-white text-sm">Add Cover Photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => onImageChange(e, 'cover')}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-white text-sm">No Cover Photo</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ProfileImageSection = ({ preview, onImageChange, onRemove }) => (
    <div className="relative -mt-16 ml-4 md:ml-8">
      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <span className="text-4xl font-semibold text-purple-600">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex space-x-2">
              <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                <Camera className="h-5 w-5 text-gray-700" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => onImageChange(e, 'profile')}
                />
              </label>
              {preview && (
                <button
                  onClick={() => onRemove('profile')}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const Notification = ({ type, message }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50 ${
      type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    } max-w-[calc(100%-2rem)] sm:max-w-md`}>
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
      ) : (
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
      )}
      <span className="text-sm">{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <Gavel className="h-8 w-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                AuctionX
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <div className="px-4 py-2 space-y-2">
            <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg">
              Dashboard
            </Link>
            <Link to="/auctions" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg">
              My Auctions
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg">
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto">
        {/* Cover and Profile Image */}
        <div className="relative">
          <CoverImageSection
            preview={previewImages.cover}
            onImageChange={handleImageChange}
            onRemove={removeImage}
          />
          <ProfileImageSection
            preview={previewImages.profile}
            onImageChange={handleImageChange}
            onRemove={removeImage}
          />
          
          {/* User Info Header */}
          <div className="ml-4 md:ml-8 mt-4 flex flex-col md:flex-row md:justify-between md:items-center pr-4 md:pr-8">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{user?.name || 'Your Name'}</h1>
              <p className="text-gray-600">@{user?.username || 'username'}</p>
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  setFormData({
                    name: user?.name || '',
                    username: user?.username || '',
                    email: user?.email || '',
                    password: '',
                    phno: user?.phno || ''
                  });
                  setErrors({});
                }
                setIsEditing(!isEditing);
              }}
              className={`mt-4 md:mt-0 px-6 py-2 rounded-lg ${
                isEditing
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } transition-colors`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Stats Grid (Bento UI) */}
        <div className="px-4 md:px-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Award} label="Won Auctions" value="12" />
            <StatCard icon={ShoppingBag} label="Active Bids" value="5" />
            <StatCard icon={Heart} label="Watchlist" value="8" />
            <StatCard icon={Clock} label="Time Active" value="2y 3m" />
          </div>
        </div>

        {/* Profile Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.name && <FormError message={errors.name} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.username ? 'border-red-500' : ''
                      }`}
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.username && <FormError message={errors.username} />}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-transparent bg-gray-50 cursor-not-allowed"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  <div className="absolute right-3 top-2.5 flex items-center">
                    <span className="hidden sm:inline text-xs text-gray-500">Cannot be changed</span>
                    <Lock className="h-4 w-4 text-gray-400 ml-1" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phno"
                    value={formData.phno}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.phno ? 'border-red-500' : ''
                    }`}
                  />
                  <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.phno && <FormError message={errors.phno} />}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.password && <FormError message={errors.password} />}
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {notification.show && (
        <Notification type={notification.type} message={notification.message} />
      )}
    </div>
  );
};

export default Profile;