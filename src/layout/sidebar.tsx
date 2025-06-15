import { Newspaper, Package, FolderOpen, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboard';
import { useLocation, useNavigate } from 'react-router-dom';

const navigationItems = [
    { name: 'News', href: '/dashboard/news', icon: Newspaper },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: FolderOpen },
];

export function Sidebar() {
    const { sidebarOpen, setSidebarOpen } = useDashboardStore();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-gray-900">Admin Panel</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>

                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Button
                                key={item.name}
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start gap-3 h-10',
                                    isActive && 'bg-blue-50 text-blue-700 border-blue-200'
                                )}
                                onClick={() => {
                                    navigate(item.href);
                                    setSidebarOpen(false);
                                }}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}