import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SuperuserRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!auth.user?.is_superuser) {
    // Redirect to dashboard or a 'not authorized' page if not a superuser
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default SuperuserRoute;
