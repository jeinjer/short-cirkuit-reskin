import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircuitLoader from '../others/CircuitLoader';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <CircuitLoader />
    </div>
  );

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;