
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("Dashboard must be within an AuthProvider");
  }

  const { user, logout } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-soft-white bg-quantum-black p-8">
      <h1 className="text-4xl font-bold text-ion-blue mb-4">Welcome to Applause</h1>
      {user && <p className="text-xl mb-8">You are logged in as: {user.email}</p>}
      <p className="mb-8">Your application dashboard is ready to be built.</p>
      <button 
        onClick={handleLogout}
        className="px-6 py-2 bg-solar-orange text-black font-bold rounded-lg hover:bg-opacity-90 transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
