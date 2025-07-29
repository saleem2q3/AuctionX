import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Gavel } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      verifyEmail(token);
    } else {
      setMessage('Invalid or missing verification token.');
      toast.error('Invalid or missing verification token.');
    }
  }, [location]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/verify?token=${token}`);
      if (response.status === 200) {
        setMessage('Email verified successfully! Redirecting to homepage...');
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
      toast.error('Verification failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <Gavel className="h-8 w-8 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              AuctionX
            </span>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default EmailVerification;
