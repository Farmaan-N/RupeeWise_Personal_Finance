import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  // Animation variants for the pulsing icon
  const iconVariants = {
    pulsing: {
      scale: [1, 1.2, 1],      // Grow and shrink
      opacity: [0.7, 1, 0.7],  // Fade in and out slightly
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity, // Loop the animation forever
      },
    },
  };

  return (
    <motion.div
      // Use the off-white background for a seamless transition
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAF5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* The new animated Rupee symbol */}
      <motion.div
        className="text-5xl font-bold text-red-500"
        variants={iconVariants}
        animate="pulsing"
      >
        ₹
      </motion.div>
      
      {/* Subtler loading text */}
      <span className="mt-4 text-sm text-gray-500">Loading...</span>
    </motion.div>
  );
};

export default LoadingScreen;