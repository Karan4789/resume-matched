
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user doesn't have the right role, redirect
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'candidate') {
      return <Navigate to="/candidate-dashboard" replace />;
    } else if (user.role === 'hr') {
      return <Navigate to="/hr-dashboard" replace />;
    }
    // Fallback to login if role is not recognized (shouldn't happen)
    return <Navigate to="/login" replace />;
  }

  // If everything is okay, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
