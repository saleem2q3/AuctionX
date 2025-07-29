import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/user-details', { withCredentials: true });
        setUserDetails(response.data.userDetails);
        setTotalUsers(response.data.totalUsers);
      } catch (err) {
        console.error('Failed to fetch user details', err);
      }
    };

    fetchUserDetails();
  }, []);

  const getImageUrl = (imageData) => {
    if (!imageData) return '/default-image.png'; // Fallback image
    return `data:image/jpeg;base64,${imageData}`;
  };

  const handleImageError = (e, fallbackSrc) => {
    if (e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <p className="mb-4">Total Users: {totalUsers}</p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-2 py-2 md:px-4 md:py-2 border">ID</th>
                <th className="px-2 py-2 md:px-4 md:py-2 border">Name</th>
                <th className="px-2 py-2 md:px-4 md:py-2 border">Email</th>
                <th className="px-2 py-2 md:px-4 md:py-2 border">Username</th>
                <th className="px-2 py-2 md:px-4 md:py-2 border">Phone Number</th>
                <th className="px-2 py-2 md:px-4 md:py-2 border">Profile Image</th>
                <th className="px-2 py-2 md:px-4 md:py-2 border">Cover Image</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((user) => (
                <tr key={user.id}>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">{user.id}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">{user.name}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">{user.email}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">{user.username}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">{user.phno}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">
                    <img
                      src={getImageUrl(user.profileImage)}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover" // Ensure the profile image is square and larger
                      onError={(e) => handleImageError(e, '/default-profile.png')}
                    />
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-2 border">
                    <img
                      src={getImageUrl(user.coverImage)}
                      alt="Cover"
                      className="h-20 w-full object-cover" // Ensure the cover image is rectangular
                      onError={(e) => handleImageError(e, '/default-cover.png')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
