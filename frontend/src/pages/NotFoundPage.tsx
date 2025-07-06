import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-quantum-black text-soft-white">
      <h1 className="text-9xl font-bold text-fusion-pink">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="px-6 py-3 bg-ion-blue text-black font-bold rounded-lg hover:bg-opacity-90 transition-all">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
