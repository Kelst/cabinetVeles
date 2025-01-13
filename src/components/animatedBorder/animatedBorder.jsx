import React from 'react';

const AnimatedBorderContainer = ({ children }) => {
  return (
    <div className="relative group">
      {/* Main content */}
      <div className="relative z-10 bg-transparent">
        {children}
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {/* Red border that moves around the container */}
        <div className="absolute top-0 right-full w-full h-[2px] bg-red-500 animate-[borderRight_4s_linear_infinite]" />
        <div className="absolute top-0 left-full w-[2px] h-full bg-red-500 animate-[borderDown_4s_linear_infinite]" />
        <div className="absolute bottom-0 left-full w-full h-[2px] bg-red-500 animate-[borderLeft_4s_linear_infinite]" />
        <div className="absolute bottom-full left-0 w-[2px] h-full bg-red-500 animate-[borderUp_4s_linear_infinite]" />
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes borderRight {
          0%, 25% {
            transform: translateX(0%);
          }
          75%, 100% {
            transform: translateX(400%);
          }
        }
        @keyframes borderDown {
          0%, 25% {
            transform: translateY(-400%);
          }
          75%, 100% {
            transform: translateY(0%);
          }
        }
        @keyframes borderLeft {
          0%, 25% {
            transform: translateX(400%);
          }
          75%, 100% {
            transform: translateX(0%);
          }
        }
        @keyframes borderUp {
          0%, 25% {
            transform: translateY(0%);
          }
          75%, 100% {
            transform: translateY(-400%);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBorderContainer;