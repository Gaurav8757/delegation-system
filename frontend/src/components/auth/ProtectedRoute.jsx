import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../../store/authStore.js';

// Protect routes based on authentication status and user role.
// If not logged in: Redirect to /auth/login.
// If role not allowed: Redirect to /unauthorized.
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, role } = useAuthStore((state) => state);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back.
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect to unauthorized page if role doesn't match.
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};
