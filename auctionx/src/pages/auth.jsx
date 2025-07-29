import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Gavel, CheckCircle2, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phno: '',
    name: ''
  });

  // Check for verification token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const message = params.get('message');

    if (message) {
      toast.success(message);
      // Remove message from URL
      window.history.replaceState({}, document.title, '/');
    }

    if (token) {
      verifyEmail(token);
    }
  }, [location]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/verify?token=${token}`);
      if (response.status === 200) {
        toast.success('Email verified successfully! Please log in.');
        setMode('login');
        // Remove token from URL
        window.history.replaceState({}, document.title, '/');
      }
    } catch (error) {
      toast.error(error.response?.data || 'Verification failed. Please try again.');
    }
  };

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    numberOrSymbol: false,
    match: false
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const resetForm = () => {
    setStep(1);
    setFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phno: '',
      name: ''
    });
    setShowPassword(false);
    setVerificationSent(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      resetForm();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setPasswordValidation({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      numberOrSymbol: /[0-9!@#$%^&*]/.test(formData.password),
      match: formData.password && formData.password === formData.confirmPassword
    });
  }, [formData.password, formData.confirmPassword]);

  if (!isOpen) return null;

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'signup' && step === 1) {
      if (!validatePhoneNumber(formData.phno)) {
        toast.error('Please enter a valid phone number (e.g., 1234567890 or 123-456-7890)');
        return;
      }
      setStep(2);
      return;
    }

    if (mode === 'signup' && step === 2) {
      if (!Object.values(passwordValidation).every(Boolean)) {
        toast.error('Please ensure all password requirements are met');
        return;
      }
    }

    const loadingToast = toast.loading(mode === 'login' ? 'Signing in...' : 'Creating your account...');

    try {
      if (mode === 'signup' && step === 2) {
        const response = await axios.post('http://localhost:8080/user/register', {
          ...formData,
          name: formData.fullName
        });
        
        toast.dismiss(loadingToast);
        setVerificationSent(true);
        toast.success('Registration successful! Please check your email for verification.');
      } else if (mode === 'login') {
        const response = await axios.post('http://localhost:8080/user/login', {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });

        if (!response.data.emailVerified) {
          toast.dismiss(loadingToast);
          toast.error('Please verify your email before logging in.');
          return;
        }

        toast.dismiss(loadingToast);
        toast.success('Successfully logged in!');
        onLoginSuccess(response.data);
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || error.response.data;

      switch (status) {
        case 400:
          toast.error(message || 'Invalid input data');
          break;
        case 401:
          toast.error('Invalid email or password');
          break;
        case 403:
          toast.error('Please verify your email before logging in');
          break;
        case 409:
          toast.error('Email is already registered');
          break;
        default:
          toast.error('An error occurred. Please try again');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection');
    } else {
      toast.error('An unexpected error occurred');
    }
  };

  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="mb-6">
              <Mail className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600">
                We've sent a verification link to <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your email and click the verification link to complete your registration.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
        } transition-colors duration-300`}>
          <span className="text-sm font-semibold">1</span>
        </div>
        <div className={`w-16 h-1 rounded ${
          step > 1 ? 'bg-purple-600' : 'bg-gray-200'
        } transition-colors duration-300`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
        } transition-colors duration-300`}>
          <span className="text-sm font-semibold">2</span>
        </div>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative group">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 transition-all duration-300"
            placeholder="Enter your email"
            required
          />
          <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 pr-10 transition-all duration-300"
            placeholder="Enter your password"
            required
          />
          <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-purple-500 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <Link 
          to="/forgot"
          className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300"
      >
        Sign in <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );

  const renderSignupStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <div className="relative group">
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 transition-all duration-300"
            placeholder="John Doe"
            required
          />
          <User className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <div className="relative group">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 transition-all duration-300"
            placeholder="john_doe"
            required
          />
          <User className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative group">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 transition-all duration-300"
            placeholder="john@example.com"
            required
          />
          <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <div className="relative group">
          <input
            type="tel"
            value={formData.phno}
            onChange={(e) => setFormData({ ...formData, phno: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 transition-all duration-300"
            placeholder="123-456-7890"
            required
          />
          <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
        </div>
      </div>
      <button
        onClick={() => {
          if (!validatePhoneNumber(formData.phno)) {
            toast.error('Please enter a valid phone number (e.g., 1234567890 or 123-456-7890)');
            return;
          }
          setStep(2);
          setFormData({ ...formData, name: formData.fullName });
        }}
        className="w-full flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300"
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );

  const renderSignupStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 pr-10 transition-all duration-300"
            placeholder="Create a password"
            required
          />
          <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-purple-500 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-2 space-y-2">
          <div className={`flex items-center text-sm ${passwordValidation.length ? 'text-green-600' : 'text-gray-600'}`}>
            <CheckCircle2 className={`h-4 w-4 mr-2 ${passwordValidation.length ? 'text-green-500' : 'text-gray-400'}`} />
            At least 8 characters
          </div>
          <div className={`flex items-center text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
            <CheckCircle2 className={`h-4 w-4 mr-2 ${passwordValidation.uppercase ? 'text-green-500' : 'text-gray-400'}`} />
            Mix of uppercase & lowercase letters
          </div>
          <div className={`flex items-center text-sm ${passwordValidation.numberOrSymbol ? 'text-green-600' : 'text-gray-600'}`}>
            <CheckCircle2 className={`h-4 w-4 mr-2 ${passwordValidation.numberOrSymbol ? 'text-green-500' : 'text-gray-400'}`} />
            At least one number or symbol
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 transition-all duration-300"
            placeholder="Confirm your password"
            required
          />
          <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 group-hover:text-purple-500 transition-colors" />
        </div>
        {formData.password && formData.confirmPassword && !passwordValidation.match && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            required
          />
        </div>
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{' '}
          <button 
            type="button" 
            onClick={() => toast.error('Terms & Conditions coming soon!')}
            className="text-purple-600 hover:text-purple-500 transition-colors"
          >
            Terms
          </button>
          {' '}and{' '}
          <button 
            type="button"
            onClick={() => toast.error('Privacy Policy coming soon!')}
            className="text-purple-600 hover:text-purple-500 transition-colors"
          >
            Privacy Policy
          </button>
        </label>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300"
        >
          Create Account <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-8 transform transition-all">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Gavel className="h-8 w-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent ml-2">
                AuctionX
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {mode === 'signup' && renderStepIndicator()}
          
          <div className="transition-all duration-300 transform">
            {mode === 'login' ? renderLoginForm() : (step === 1 ? renderSignupStep1() : renderSignupStep2())}
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                type="button"
                onClick={() => toast.error('Google Sign In coming soon!')}
                className="w-full flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;