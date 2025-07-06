import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', children, ...props }) => {
  const baseClasses = "px-6 py-3 font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform focus:outline-none focus:ring-4 focus:ring-opacity-50 hover:scale-105 active:scale-100";

  const variantClasses = {
    primary: 'bg-fusion-pink text-white hover:shadow-lg hover:shadow-fusion-pink/30 focus:ring-fusion-pink',
    secondary: 'bg-ion-blue text-black hover:shadow-lg hover:shadow-ion-blue/30 focus:ring-ion-blue',
    tertiary: 'bg-solar-orange text-black hover:shadow-lg hover:shadow-solar-orange/30 focus:ring-solar-orange',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
