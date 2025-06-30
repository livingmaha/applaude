// File: /frontend/src/components/core/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // This case should ideally not happen if the component is used correctly
    return <Navigate to="/login" />;
  }

  const { isAuthenticated } = authContext;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;
