// src/routes/ProtectedRoute.tsx
import Loader from '@/components/loader/loader';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, [pathname])

    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <Loader />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
