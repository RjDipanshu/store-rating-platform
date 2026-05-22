import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  // 1. If not logged in at all, force redirect straight to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but the user's role isn't authorized for this section, block them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authenticated and role verified -> render nested page views safely
  return <Outlet />;
}