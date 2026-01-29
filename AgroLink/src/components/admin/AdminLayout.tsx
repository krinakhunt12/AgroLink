import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserCheck, Package, ShoppingCart,
    Settings, LogOut, ShieldCheck, Menu, X,
    BrainCircuit, Bell, Search,
    Activity
} from 'lucide-react';
import { authAPI } from '../../services/api';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Farmers', path: '/admin/farmers' },
        { icon: UserCheck, label: 'Buyers', path: '/admin/buyers' },
        { icon: Package, label: 'Crop Listings', path: '/admin/listings' },
        { icon: ShoppingCart, label: 'Orders / Transactions', path: '/admin/orders' },
        { icon: BrainCircuit, label: 'AI Monitoring', path: '/admin/ml-ops' },
        { icon: Activity, label: 'System Health', path: '/admin/health' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        authAPI.logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden font-['Outfit']">
            {/* Sidebar Overlay for Mobile */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-surface)] border-r border-[var(--border-base)] transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Brand Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-[var(--border-base)]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">AgroLink Admin</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-[var(--bg-muted)] text-[var(--brand-primary)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
                                    }
                                `}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-[var(--border-base)]">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-[var(--radius-theme)] transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-base)] flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-[var(--text-muted)] lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold text-[var(--text-primary)] hidden md:block">
                            Smart Agro-Market – Admin
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-4 border-r border-[var(--border-base)]">
                            <div className="w-8 h-8 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--brand-primary)] font-bold text-xs">
                                AD
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-[var(--text-primary)] leading-none text-left">Administrator</p>
                                <p className="text-[11px] text-[var(--text-muted)] mt-1 text-left">Super Admin Role</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
