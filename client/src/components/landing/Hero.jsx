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

        {/* --- Right Image Section (Enhanced 3D Effect for All Viewports) --- */}
        <div className="md:w-1/2 relative flex justify-center items-center h-[450px] md:h-[500px] lg:h-[600px] mt-8 md:mt-0 overflow-hidden rounded-2xl" 
          style={{ perspective: '1200px' }}>  
          
          {/* Soft Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40 z-10 opacity-80 blur-lg" />

          {/* Foreground Image (Landingpage1.png) with Enhanced 3D Transform for All Viewports */}
          <div className="relative w-[70%] sm:w-[65%] md:w-[58%] z-20 transform-gpu transition-transform duration-700 ease-out
            rotate-y-15 sm:rotate-y-20 md:rotate-y-25 
            -rotate-x-5 sm:-rotate-x-8 md:-rotate-x-10
            scale-110 sm:scale-115 md:scale-125
            translate-z-50 sm:translate-z-75 md:translate-z-100
            translate-x-6 sm:translate-x-8 md:translate-x-12
            translate-y-[-2%] sm:translate-y-[-3%] md:translate-y-[-5%]"
            style={{
              transformStyle: 'preserve-3d',
              filter: `
                drop-shadow(0 20px 20px rgba(0,0,0,0.2))
                drop-shadow(0 30px 40px rgba(0,0,0,0.15))
                drop-shadow(0 40px 50px rgba(0,0,0,0.1))
              `,
            }}
          >
            <img
              src="/assets/Landingpage1.png"
              alt="App Screenshot Foreground"
              className="w-full h-auto rounded-2xl"
            />
            
            {/* Enhanced Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-white/15 to-transparent mix-blend-soft-light transform rotate-180 rounded-2xl" />
          </div>

          {/* Background Image (Landingpage2.png) with enhanced scale */}
          <img 
            src="/assets/Landingpage2.png" 
            alt="App Screenshot Background" 
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-110 sm:scale-115 md:scale-125 -translate-x-4 sm:-translate-x-6 z-10 opacity-85" 
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 z-30">
            <div className="absolute inset-y-0 left-0 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-[#FAFAF5] via-[#FAFAF5]/80 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-6 sm:w-8 md:w-12 bg-gradient-to-l from-[#FAFAF5]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-8 sm:h-10 md:h-12 bg-gradient-to-t from-[#FAFAF5]/40 to-transparent" />
          </div>
          
          {/* Enhanced Container Shadow with Mobile Optimization */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl z-0 bg-white/5" />
        </div>
        {/* --- End of Right Image Section --- */}

      </div>

      {/* About Section */}
      <div id="about" className="py-20 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">About RupeeWise</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-6">
              RupeeWise is your personal finance companion designed to help you take control of your financial journey. 
              Our platform combines powerful expense tracking, smart calendaring, and AI-powered insights to make 
              financial management effortless and effective.
            </p>
            <p className="text-lg text-gray-600">
              Built with a focus on simplicity and usability, RupeeWise helps you make informed financial decisions 
              and achieve your monetary goals, one step at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;