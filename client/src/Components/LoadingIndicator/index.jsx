import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingIndicator Component
 * A reusable loading indicator with a spinner and customizable message
 *
 * @param {string} message - The main loading message (default: "Loading...")
 * @param {string} subMessage - Optional secondary message
 * @param {string} size - Size of the spinner: "sm", "md", "lg" (default: "lg")
 */
const LoadingIndicator = ({
  message = 'Loading...',
  subMessage = 'Please wait while we fetch the data.',
  size = 'lg',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
      <Loader2
        className={`${sizeClasses[size]} text-blue-600 mx-auto mb-4 animate-spin`}
      />
      <h3 className='text-xl font-semibold text-slate-800 mb-2'>{message}</h3>
      {subMessage && <p className='text-slate-600'>{subMessage}</p>}
    </div>
  );
};

export default LoadingIndicator;
