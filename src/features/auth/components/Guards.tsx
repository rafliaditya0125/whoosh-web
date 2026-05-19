import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function GuestGuard() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'manager') return <Navigate to="/manager" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function AdminGuard() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login/staff" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

export function ManagerGuard() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login/staff" replace />;
  if (user?.role !== 'manager' && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

export function UserGuard() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'user') {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'manager') return <Navigate to="/manager" replace />;
  }
  return <Outlet />;
}
