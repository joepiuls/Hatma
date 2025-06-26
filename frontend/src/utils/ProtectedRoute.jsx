import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return; 
    
    if (!isAuthenticated) {
      navigate('/login');
    } else if (adminOnly && !user?.isAdmin) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, hasHydrated, navigate, adminOnly]);

  if (!hasHydrated) {
    return <LoadingSpinner />;
  }

  return isAuthenticated && (!adminOnly || user?.isAdmin) ? (
    <Outlet />
  ) : null;
};

export default ProtectedRoute;