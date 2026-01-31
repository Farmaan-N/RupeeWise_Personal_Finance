import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function ErrorElement() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf9f5] overflow-hidden font-sans'>
      
      {/* Decorative Floating Rupee Symbols (Unique Finance Touch) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
  key={i}
  initial={{ opacity: 0, scale: 0 }}
  animate={{ 
    opacity: [0, 0.5, 0],
    scale: [0.5, 1.2, 0.5],
    rotateY: [0, 720], // The "Coin Flip"
    y: [0, -200]
  }}
  transition={{ 
    duration: 6, 
    repeat: Infinity, 
    delay: i * 1.5 
  }}
  className="absolute text-6xl font-bold text-amber-500/20 select-none"
  style={{ 
    left: `${Math.random() * 90}%`, 
    top: `${20 + (i * 10)}%` 
  }}
>
  ₹
</motion.div>

      ))}

      

      <div className="relative z-10 text-center px-6">
        {/* Interactive Main Visual */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <motion.h1 
            drag
            dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
            className='text-8xl md:text-9xl font-black text-slate-800 cursor-grab active:cursor-grabbing'
          >
            4<span className="text-red-500">0</span>4
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className='text-2xl md:text-3xl font-bold text-slate-700'>
            This Transaction Failed!
          </h2>
          <p className='text-slate-500 mt-3 max-w-md mx-auto text-lg'>
            We couldn't find the page you're looking for in your record. 
            It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/dashboard" 
                className='px-8 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:bg-red-700 transition-all inline-block w-full sm:w-auto'
              >
                Back to Dashboard
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/" 
                className='px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all inline-block w-full sm:w-auto'
              >
                Go Home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Footer Hint */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-sm text-slate-400"
      >
        Error Code: 404_PAGE_NOT_FOUND_IN_ASSETS
      </motion.p>
    </div>
  );
}

export default ErrorElement;
