import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const authContext = useContext(AuthContext);

  // If context is not available, it's a loading/error state. Redirect to login.
  if (!authContext) {
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
