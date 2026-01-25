import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'farmer' | 'buyer';
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
        const redirectPath = user?.userType === 'farmer' ? '/dashboard' : '/buyer/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
