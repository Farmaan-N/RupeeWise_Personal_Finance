import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideNav from '../components/SideNav';
import { useLoading } from '../context/LoadingContext';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';

const ProtectedLayout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const { isLoading } = useLoading();

  // Close nav on route change
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when nav is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isNavOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isNavOpen]);

  return (
    // Updated main background to #FAFAF5
    <div className="min-h-screen bg-[#FAFAF5] text-gray-900 font-sans">
      <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Main content area shifts right ONLY on desktop */}
      <div className="md:pl-60">

        {/* --- MOBILE HEADER --- */}
        {/* Updated background, border, and text colors */}
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm md:hidden">
          <button
            onClick={() => setIsNavOpen(true)}
            // Updated text colors
            className="rounded-md p-2 text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>
        {/* --- END OF MOBILE HEADER --- */}

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Loading screen logic remains the same */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loader" />
            ) : (
              <div key={location.pathname}>
                <Outlet />
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;