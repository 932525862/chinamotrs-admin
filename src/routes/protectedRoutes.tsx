// src/routes/ProtectedRoute.tsx
import Loader from '@/components/loader/loader';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
    const { pathname } = useLocation();
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({ top: 0 });

        // Validate token presence on first load
        checkAuth();
    }, [pathname]);

    // Optional: show loading UI during auth check
    if (isLoading) {
        return <Loader />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Allow access to child routes
    return <Outlet />;
}
