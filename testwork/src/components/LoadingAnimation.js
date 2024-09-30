import React from 'react';

const LoadingAnimation = ({ imageWidth }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="relative w-72 h-72 border-4 border-gray-300 overflow-hidden">
        <img
          src="/img/loading-image.jpg"
          alt="Loading"
          className="absolute top-0 left-0 h-full object-cover transition-all duration-[3000ms] ease-linear"
          style={{ width: imageWidth }}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
