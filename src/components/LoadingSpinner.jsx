import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Retrieving real-time FinOps details...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={`animate-spin rounded-full border-t-indigo-500 border-r-indigo-500/20 border-b-indigo-500/20 border-l-indigo-500/20 ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-sm text-slate-400 font-medium animate-pulse-subtle">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
