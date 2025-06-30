
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ion-blue">
          {icon}
        </span>
        <input
          type={type}
          className={`w-full bg-gray-700 bg-opacity-30 text-soft-white placeholder-gray-400 border border-transparent focus:border-ion-blue focus:ring-0 focus:outline-none rounded-lg py-3 pr-3 ${
            icon ? 'pl-10' : 'pl-4'
          } ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
