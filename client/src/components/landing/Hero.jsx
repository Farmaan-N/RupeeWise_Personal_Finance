import React from 'react';
import { useLoading } from '../../context/LoadingContext';

const Hero = () => {
  const { showLoaderAndNavigate } = useLoading();
  const handleStartFreeTrial = () => {
    showLoaderAndNavigate('/register');
  };

  return (
    <section id="hero" className="relative bg-[#FAFAF5] pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Content - Improvised Typography & Styles */}
        <div className="md:w-1/2 lg:w-5/12 text-center md:text-left mb-8 md:mb-0 relative z-10">
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 text-slate-900 tracking-tight">
            Control your <span className="text-teal-700">money</span>, <br /> 
            <span className="text-slate-800/90">effortlessly.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
            Track expenses, manage reminders with our calendar, plan with financial calculators, and get personalized tips from our AI bot.
          </p>

          <button
            onClick={handleStartFreeTrial}
            className="bg-teal-700 text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-teal-800 transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(15,118,110,0.4)] hover:shadow-[0_20px_25px_-5px_rgba(15,118,110,0.4)] active:scale-95"
          >
            GET STARTED FOR FREE
          </button>
        </div>

        {/* Right Image Section - Content Unchanged */}
        <div className="md:w-1/2 lg:w-7/12 relative flex justify-center md:justify-end items-center h-[450px] md:h-[550px] lg:h-[650px]">
          <img 
            src="/assets/Landingpage1.png" 
            alt="RupeeWise App Interface" 
            className="h-[95%] md:h-full w-auto object-contain scale-[1.3] md:translate-x-8 lg:translate-x-16"
          />
        </div>
      </div>

      {/* About Section - Content Unchanged */}
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
