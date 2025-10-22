import React from 'react';
import { Link } from 'react-router-dom'; // Must import from 'react-router-dom'
import { useLoading } from '../context/LoadingContext';

const LoaderLink = ({ to, children, className }) => {
  const { showLoaderAndNavigate } = useLoading();

  const handleClick = (e) => {
    e.preventDefault(); // This is critical to stop the instant navigation
    showLoaderAndNavigate(to);
  };

  return (
    // This MUST be a <Link> component, not an <a> tag
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default LoaderLink;