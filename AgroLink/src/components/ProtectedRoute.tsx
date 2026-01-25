import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard if role doesn't match
        if (role === 'farmer') {
            return <Navigate to="/farmer/dashboard" replace />;
        } else {
            return <Navigate to="/buyer/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;


/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication
 * Optionally checks for specific user roles
 */
