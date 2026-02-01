import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../services/api';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    requiredRole?: 'farmer' | 'buyer' | 'admin';
    requireVerification?: boolean; // New prop to enforce verification
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes with multi-level access control:
 * 1. Authentication check (logged in or not)
 * 2. Role-based access control (farmer/buyer/admin)
 * 3. Verification status check (for farmers only)
 * 
 * Access Control Logic:
 * - Not logged in → Redirect to /login
 * - Wrong role → Redirect to appropriate dashboard
 * - Unverified farmer accessing restricted route → Redirect to /verify-profile
 * - Unverified farmer accessing verification page → Allow access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requireVerification = false
}) => {
    const location = useLocation();
    const isAuthenticated = authAPI.isAuthenticated();
    const user = authAPI.getCurrentUser();

    /**
     * STEP 1: Authentication Check
     * If user is not logged in, redirect to login page
     */
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    /**
     * STEP 2: Role-Based Access Control (RBAC)
     * If a specific role is required and user doesn't have it,
     * redirect to their appropriate dashboard
     */
    if (requiredRole && user?.userType !== requiredRole) {
        let redirectPath = '/';
        if (user?.userType === 'farmer') redirectPath = '/farmer/dashboard';
        else if (user?.userType === 'buyer') redirectPath = '/buyer/dashboard';
        else if (user?.userType === 'admin') redirectPath = '/admin/dashboard';

        return <Navigate to={redirectPath} replace />;
    }

    /**
     * STEP 3: Verification Status Check (Farmers Only)
     * 
     * Special handling for farmer verification:
     * - If farmer is unverified AND trying to access a restricted route
     * - Redirect to verification page
     * - BUT allow access to the verification page itself
     */
    if (requireVerification && user?.userType === 'farmer' && !user?.isVerified) {
        // Allow access to verification page itself (no redirect loop)
        const isVerificationPage = location.pathname === '/verify-profile';

        if (!isVerificationPage) {
            // Redirect to verification page with return URL
            return <Navigate
                to="/verify-profile"
                state={{ from: location }}
                replace
            />;
        }
    }

    /**
     * All checks passed - render the protected content
     */
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
