import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showLoaderAndNavigate = (path) => {
    setIsLoading(true);
    // This delay is essential. It allows the LoadingScreen to render first.
    setTimeout(() => {
      navigate(path);
      // A second small delay before hiding ensures the new page has started rendering.
      setTimeout(() => setIsLoading(false), 50); 
    }, 500); // 500ms for the loading screen to be visible
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoaderAndNavigate }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};