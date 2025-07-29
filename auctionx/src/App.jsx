import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import Blog from './pages/Blog'; // Import Blog page
import About from './pages/About'; // Import About page
import AdminLogin from './pages/AdminLogin'; // Import AdminLogin page
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard component
import UserDetails from './components/UserDetails'; // Import UserDetails component

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/blog" element={<Blog />} /> {/* Add Blog route */}
          <Route path="/about" element={<About />} /> {/* Add About route */}
          <Route path="/admin/login" element={<AdminLogin />} /> {/* Add AdminLogin route */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Add AdminDashboard route */}
          <Route path="/admin/user-details" element={<UserDetails />} /> {/* Add UserDetails route */}
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;