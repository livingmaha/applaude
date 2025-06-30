
import React from 'react';

interface AppSimulatorProps {
  children: React.ReactNode;
  palette?: {
    primary: string;
    secondary: string;
    background: string;
    text_dark: string;
  }
}

const AppSimulator: React.FC<AppSimulatorProps> = ({ children, palette }) => {
  const screenStyle = {
    backgroundColor: palette?.background || '#FFFFFF',
    color: palette?.text_dark || '#000000',
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
        {/* Notch */}
        <div className="w-[140px] h-[28px] bg-gray-800 top-0 rounded-b-xl left-1/2 -translate-x-1/2 absolute"></div>
        {/* Screen */}
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800">
          <div style={screenStyle} className="w-full h-full p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSimulator;
