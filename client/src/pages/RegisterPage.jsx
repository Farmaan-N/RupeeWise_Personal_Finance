import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import LoaderLink from '../components/LoaderLink';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showLoaderAndNavigate } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        'http://localhost:5000/api/users/register',
        { name, email, password },
        config
      );
      login(data);
      showLoaderAndNavigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    // Add 'relative', change background to light gray, text to dark
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Position the App Name absolutely in the top-left */}
      <div className="absolute top-1 left-2 sm:top-2 sm:left-3 lg:top-3 lg:left-4"> <span className="text-sm sm:text-base lg:text-lg text-gray-900"> <span className="font-bold">Rupee</span> <span className="font-normal"> Wise</span> </span> </div>

      {/* Register Card Container */}
      <div className="w-full max-w-md">
        {/* Changed Card Style to Light */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>
          {/* Adjusted Error Message Style */}
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4"> {/* Adjusted spacing */}
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="name">Display Name</label>
              <input
                // Updated Input Styles
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="email">Email Address</label>
              <input
                // Updated Input Styles
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="password">Password</label>
              <input
                // Updated Input Styles
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              // Updated Button Styles (Using Red Accent)
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            {/* Updated Link Style */}
            <LoaderLink to="/login" className="font-medium text-red-600 hover:underline">
              Log in
            </LoaderLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;