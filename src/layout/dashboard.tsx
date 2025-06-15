import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAuthStore } from '@/stores/auth';
// import { useDashboardStore } from '@/stores/dashboard';

export function DashboardLayout() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-5">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}