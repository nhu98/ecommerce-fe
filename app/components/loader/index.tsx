import React from 'react';

const LoaderComponent = () => {
  return (
    <div className="absolute  inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoaderComponent;
