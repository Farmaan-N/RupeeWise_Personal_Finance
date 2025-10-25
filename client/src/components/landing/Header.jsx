import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoaderLink from '../LoaderLink';
import { useLoading } from '../../context/LoadingContext';

// Smooth scroll function
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 64; // Height of your fixed header
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showLoaderAndNavigate } = useLoading();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      showLoaderAndNavigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'FEATURES', id: 'features' },
    { name: 'PRICING', id: 'pricing' },
    { name: 'ABOUT', id: 'about' }
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">RUPEE WISE</span>
          </div>

          {/* --- UPDATED SECTION: Wrapper for Desktop Nav + Login --- */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav className="flex space-x-8 text-sm font-semibold">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="py-2 border-b-2 border-transparent text-gray-600 hover:border-red-500 hover:text-red-500 transition-all duration-300 ease-in-out"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Desktop Login Button */}
            <button
              onClick={handleLoginClick}
              className="bg-gray-900 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              LOG IN
            </button>
          </div>

          {/* --- MOBILE HAMBURGER (Unchanged) --- */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-600 focus:outline-none p-2" aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU PANEL (Unchanged) --- */}
      <div className={`absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col space-y-2 p-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleNavClick(e, link.id)}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 ease-in-out"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 mt-2 border-t border-gray-200">
             <LoaderLink
              to={user ? "/dashboard" : "/login"}
              onClick={toggleMobileMenu}
              className="block w-full text-center bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-base font-medium shadow-sm"
            >
              LOG IN
            </LoaderLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;