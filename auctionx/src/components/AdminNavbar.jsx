import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Users, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("http://localhost:8080/admin/logout", {}, { withCredentials: true })
      .then(() => navigate("/admin/login"))
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center space-x-2 group">
          <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            AuctionX
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/admin/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/admin/user-details" className="hover:text-blue-600">User Details</Link>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <motion.button
            onClick={() => setDropdownOpen((prev) => !prev)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            Menu <ChevronDown size={18} className={`${dropdownOpen ? "rotate-180" : "rotate-0"} transition-transform`} />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10"
              >
                <Link
                  to="/admin/user-details"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Users size={18} /> User Details
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
