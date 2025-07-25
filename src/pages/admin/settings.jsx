import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_number: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please login.');
        }

        const response = await axios({
          method: 'get',
          url: 'https://api-uks.rplrus.com/api/user',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const { name, email, phone_number } = response.data.data;
        setProfile({ name, email, phone_number: phone_number || '' });
      } catch (err) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login.');
      }

      const response = await axios({
        method: 'put',
        url: 'https://api-uks.rplrus.com/api/user/update',
        data: profile,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile. Please check the method or endpoint.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-pulse">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>
          <p className="text-center text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
          <p className="text-gray-500 mt-2 text-sm">Update your personal information</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 animate-fade-in">
            {success}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-200 ease-in-out py-3 px-4 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-200 ease-in-out py-3 px-4 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-200 ease-in-out py-3 px-4 bg-gray-50"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
              >
                Back to Dashboard
              </Link>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 ease-in-out font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Full Name</p>
              <p className="mt-1 text-lg text-gray-900 font-semibold">{profile.name || 'Not set'}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Email Address</p>
              <p className="mt-1 text-lg text-gray-900 font-semibold">{profile.email || 'Not set'}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Phone Number</p>
              <p className="mt-1 text-lg text-gray-900 font-semibold">{profile.phone_number || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 ease-in-out font-medium"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;