import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FocusTrap from 'focus-trap-react';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';

// Reusable Nav Item component
const NavItem = ({ to, children, onClose }) => {
  const { showLoaderAndNavigate } = useLoading();
  const location = useLocation();
  const isActive = location.pathname === to;

  // Updated link styles for light theme
  const linkClasses = "w-full text-left flex items-center gap-3 rounded-md px-2 py-2 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900";
  // Updated active styles for light theme with red accent
  const activeLinkClasses = "bg-red-50 text-red-700 border-l-4 border-red-500 font-semibold";

  const handleClick = () => {
    if (onClose) onClose();
    if (!isActive) showLoaderAndNavigate(to);
  };

  return <button onClick={handleClick} className={`${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{children}</button>;
};

// Main navigation content
const SideNavContent = ({ onClose }) => {
  const { user } = useAuth();
  const initial = (user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();
  const displayName = user?.name || user?.email;

  return (
    <>
      {/* Updated header section styles */}
      <div className="flex h-20 items-center border-b border-gray-200 px-4">
        <div className="flex items-center gap-3">
          {/* Updated avatar style */}
          <div className="w-10 h-10 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-lg">{initial}</div>
          <div className="flex flex-col overflow-hidden">
            {/* Updated text colors */}
            <span className="text-sm text-gray-500">Hi,</span>
            <span className="text-md font-bold text-gray-900 truncate" title={displayName}>{displayName}</span>
          </div>
        </div>
      </div>
      {/* Updated nav styles */}
      <nav className="flex-1 overflow-auto py-3 px-3 text-sm font-medium flex flex-col space-y-1">
        <NavItem to="/dashboard" onClose={onClose}>Dashboard</NavItem>
        <NavItem to="/calendar" onClose={onClose}>Calendar</NavItem>
        <NavItem to="/calculators" onClose={onClose}>Calculators</NavItem>
        <NavItem to="/profile" onClose={onClose}>Profile</NavItem>
      </nav>
    </>
  );
};

// Component that renders Desktop Sidebar OR Mobile Drawer
const SideNav = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { showLoaderAndNavigate } = useLoading();

  const handleLogout = () => {
    onClose();
    logout();
    showLoaderAndNavigate('/');
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Updated button styles for light theme
  const logoutButtonClasses = "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-red-600 hover:bg-red-50 active:bg-red-100";

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      {/* Updated background and border */}
      <div className="hidden border-r border-gray-200 bg-white md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-60 md:flex-col">
        <SideNavContent onClose={() => {}} />
        {/* Updated border */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button onClick={handleLogout} className={logoutButtonClasses}>Logout</button>
        </div>
      </div>

      {/* --- MOBILE DRAWER --- */}
      {isOpen && (
        <div className="md:hidden">
          <FocusTrap active={isOpen}>
            <div>
              {/* Overlay remains the same */}
              <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
              {/* Updated drawer background and border */}
              <div role="dialog" aria-modal="true" id="sidenav-mobile" className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white">
                <SideNavContent onClose={onClose} />
                {/* Updated border */}
                <div className="mt-auto p-4 border-t border-gray-200">
                  <button onClick={handleLogout} className={logoutButtonClasses}>Logout</button>
                </div>
              </div>
            </div>
          </FocusTrap>
        </div>
      )}
    </>
  );
};

export default SideNav;