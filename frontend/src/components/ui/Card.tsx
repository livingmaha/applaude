import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-black bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-10 
                  relative overflow-hidden group transition-all duration-300 ease-in-out 
                  hover:scale-[1.01] hover:shadow-2xl hover:border-transparent 
                  ${className || ''}`}
      onClick={onClick}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="h-full w-full rounded-[1.25rem] bg-gradient-to-r from-ion-blue to-fusion-pink animate-pulse-glow" />
      </div>
      <div className="relative z-10 p-6 h-full w-full"> {/* Ensure content is on top */}
        {children}
      </div>
    </div>
  );
};

export default Card;
