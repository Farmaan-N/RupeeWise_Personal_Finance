import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // State for forms
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for UI feedback
  const [nameMessage, setNameMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [deleteError, setDeleteError] = useState('');

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameMessage({ type: '', text: '' });
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, { name }, config);
      const updatedUser = { ...user, name: data.name, token: data.token };
      login(updatedUser);
      setNameMessage({ type: 'success', text: 'Name updated successfully!' });
    } catch (error) {
      setNameMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update name.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const body = { currentPassword, newPassword };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/change-password`, body, config);
      setPasswordMessage({ type: 'success', text: 'Password changed! Logging you out...' });
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all of your data. This action cannot be undone.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/profile`, config);
        logout();
        navigate('/login');
      } catch (error) {
        setDeleteError(error.response?.data?.message || 'Failed to delete account.');
      }
    }
  };

  const initial = (user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="bg-[#FAFAF5] p-4 sm:p-6 lg:p-8 rounded-lg">

      {/* --- Profile Header --- */}
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 border-b border-gray-200 pb-8">
        {/* --- CHANGES HERE: Reduced w- h- and text- size --- */}
        <div className="w-16 h-16 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-2xl">
          {initial}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>
      {/* --- END: Profile Header --- */}

      <div className="space-y-8">
        {/* Profile Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Profile Information</h2>
          <form onSubmit={handleNameUpdate}>
            <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {nameMessage.text && <p className={`mt-2 text-sm ${nameMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{nameMessage.text}</p>}
            <button type="submit" className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Save Name</button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            {passwordMessage.text && <p className={`mt-2 text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage.text}</p>}
            <button type="submit" className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Change Password</button>
          </form>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-700 mb-4">Deleting your account is a permanent action and cannot be reversed.</p>
          {deleteError && <p className="text-red-700 mb-4">{deleteError}</p>}
          <button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;