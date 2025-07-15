import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 
                  relative overflow-hidden group transition-all duration-300 ease-in-out 
                  hover:shadow-2xl hover:border-black
                  ${className || ''}`}
      onClick={onClick}
    >
      <div className="relative z-10 p-6 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
