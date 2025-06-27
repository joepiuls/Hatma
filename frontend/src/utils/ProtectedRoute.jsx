// src/utils/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
    } else if (adminOnly && !user?.isAdmin) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, hasHydrated, navigate, adminOnly, location.pathname]);

  if (!hasHydrated) return <LoadingSpinner />;

  if (isAuthenticated && (!adminOnly || user?.isAdmin)) {
    return <Outlet />;
  }

  return <LoadingSpinner />;
};

export default ProtectedRoute;
