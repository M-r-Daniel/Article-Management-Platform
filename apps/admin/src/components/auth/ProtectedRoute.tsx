import { Navigate, Outlet } from 'react-router';
import { isAuthenticated } from '../../lib/auth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * Route protection wrapper component. Redirects unauthenticated
 * requests to the login screen.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
export default ProtectedRoute;
