import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../services/api';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    requiredRole?: 'farmer' | 'buyer' | 'admin';
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication
 * Optionally checks for specific user roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const location = useLocation();
    const isAuthenticated = authAPI.isAuthenticated();
    const user = authAPI.getCurrentUser();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If role is required and doesn't match, redirect to appropriate dashboard
    if (requiredRole && user?.userType !== requiredRole) {
        let redirectPath = '/';
        if (user?.userType === 'farmer') redirectPath = '/dashboard';
        else if (user?.userType === 'buyer') redirectPath = '/buyer/dashboard';
        else if (user?.userType === 'admin') redirectPath = '/admin/dashboard';

        return <Navigate to={redirectPath} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
