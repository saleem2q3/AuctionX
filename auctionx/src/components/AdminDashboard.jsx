import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {/* Add your dashboard content here */}
        <p>Welcome to the Admin Dashboard. Here you can manage users, auctions, and settings.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
