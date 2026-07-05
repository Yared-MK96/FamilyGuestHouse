import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect any page that requires login
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Protect admin-only routes
export function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
