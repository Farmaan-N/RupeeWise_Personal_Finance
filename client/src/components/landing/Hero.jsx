import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

const Hero = () => {
  const navigate = useNavigate();
  const { showLoaderAndNavigate } = useLoading();
  const handleStartFreeTrial = () => {
    showLoaderAndNavigate('/register');;
  };

  return (
    <section id="hero" className="relative bg-[#FAFAF5] text-gray-900 pt-24 ...">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 relative z-10">
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
            Control your money,<br /> effortlessly. 
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            Track expenses, manage reminders with our calendar, plan with financial calculators, and get personalized tips from our AI bot.
          </p>
          <button
            onClick={handleStartFreeTrial}
            className="bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-teal-800 transition-colors duration-300 shadow-lg"
          >
            GET STARTED FOR FREE
          </button>
        </div>

        {/* --- Right Image Section (Updated) --- */}
        <div className="md:w-1/2 relative flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] mt-12 md:mt-0 overflow-hidden rounded-2xl">  
          {/* Background Image (Landingpage2.png) - Fills the container */}
           <img src="/assets/Landingpage2.png" alt="App Screenshot Background" className="absolute inset-0 w-full h-full object-cover object-left transform scale-110 -translate-x-6" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FAFAF5] to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-0 shadow-[inset_0_0_0_0_rgba(0,0,0,0)]" />
          
          {/* Foreground Image (Landingpage1.png) - Angled on top */}
          <img
            src="/assets/Landingpage1.png" // Ensure path is correct
            alt="App Screenshot Foreground"
            className="relative w-3/5 md:w-1/2 h-auto transform rotate-6 z-10"
            style={{ filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.4))' }}
          />
        </div>
        {/* --- End of Right Image Section --- */}

      </div>
    </section>
  );
};

export default Hero;