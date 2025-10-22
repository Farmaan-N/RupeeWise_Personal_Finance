import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If user is logged in, show the page. Otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;