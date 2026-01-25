import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Menu, X, Sprout, LogOut, User, Settings,
    LayoutDashboard, Package, ShoppingBag, MessageSquare,
    ShoppingCart, Heart, Search
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import { useToast } from '../Toast';
import AppLogger from '../../utils/logger';

interface DashboardLayoutProps {
    userType: 'farmer' | 'buyer';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userType }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const user = authAPI.getCurrentUser();

    // Navigation items based on user type
    const farmerNavItems = [
        { path: '/dashboard', label: 'ડેશબોર્ડ', icon: LayoutDashboard },
        { path: '/dashboard/products', label: 'મારા ઉત્પાદનો', icon: Package },
        { path: '/dashboard/orders', label: 'ઓર્ડર્સ', icon: ShoppingBag },
        { path: '/dashboard/bids', label: 'બિડ્સ', icon: MessageSquare },
        { path: '/dashboard/profile', label: 'પ્રોફાઇલ', icon: User },
    ];

    const buyerNavItems = [
        { path: '/buyer/dashboard', label: 'ડેશબોર્ડ', icon: LayoutDashboard },
        { path: '/buyer/marketplace', label: 'માર્કેટપ્લેસ', icon: Search },
        { path: '/buyer/cart', label: 'કાર્ટ', icon: ShoppingCart },
        { path: '/buyer/orders', label: 'મારા ઓર્ડર્સ', icon: ShoppingBag },
        { path: '/buyer/wishlist', label: 'વિશલિસ્ટ', icon: Heart },
        { path: '/buyer/profile', label: 'પ્રોફાઇલ', icon: User },
    ];

    const navItems = userType === 'farmer' ? farmerNavItems : buyerNavItems;

    const handleLogout = () => {
        try {
            // Clear auth data
            authAPI.logout();

            // Clear TanStack Query cache
            queryClient.clear();

            // Show success message
            showToast('લોગઆઉટ સફળ રહ્યું!', 'success');

            // Log the action
            AppLogger.info('Auth', { message: 'User logged out successfully' });

            // Redirect to landing page
            navigate('/', { replace: true });
        } catch (error) {
            AppLogger.error('Auth', error);
            showToast('લોગઆઉટમાં ભૂલ થઈ', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-green-100 rounded-full p-1.5 group-hover:rotate-12 transition-transform">
                            <Sprout className="h-5 w-5 text-green-700" />
                        </div>
                        <span className="font-bold text-lg text-gray-900">ખેડૂત સેતુ</span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{userType}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard' || item.path === '/buyer/dashboard'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        લોગઆઉટ
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - Mobile */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-green-100 rounded-full p-1.5">
                            <Sprout className="h-5 w-5 text-green-700" />
                        </div>
                        <span className="font-bold text-lg text-gray-900">ખેડૂત સેતુ</span>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <>
                        <div
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col">
                            {/* User Info */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-green-700" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{userType}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/dashboard' || item.path === '/buyer/dashboard'}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? 'bg-green-50 text-green-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    લોગઆઉટ
                                </button>
                            </div>
                        </aside>
                    </>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
