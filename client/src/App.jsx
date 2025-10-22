import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // We only need AnimatePresence now

import { useLoading } from './context/LoadingContext';
import LoadingScreen from './components/LoadingScreen';
import ProtectedLayout from './layouts/ProtectedLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import CalculatorsPage from './pages/CalculatorsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { isLoading } = useLoading();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* If isLoading is true, show the LoadingScreen */}
      {isLoading ? (
        <LoadingScreen key="loader" />
      ) : (
        /* Otherwise, show the page content directly without animation */
        <div key={location.pathname}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/calculators" element={<CalculatorsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      )}
    </AnimatePresence>
  );
}

export default App;