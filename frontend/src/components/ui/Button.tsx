
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', children, ...props }) => {
  const baseClasses = "px-6 py-3 font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-fusion-pink text-white hover:bg-opacity-90',
    secondary: 'bg-ion-blue text-black hover:bg-opacity-90',
    tertiary: 'bg-solar-orange text-black hover:bg-opacity-90',
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
