import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserCheck, Package, ShoppingCart,
    BarChart3, Settings, LogOut, ShieldCheck, Menu, X,
    BrainCircuit, Bell, Search, TrendingUp, History, Database
} from 'lucide-react';
import { authAPI } from '../../services/api';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Farmers Management', path: '/admin/farmers' },
        { icon: UserCheck, label: 'Buyers Management', path: '/admin/buyers' },
        { icon: Package, label: 'Crop Listings', path: '/admin/listings' },
        { icon: ShoppingCart, label: 'Transactions / Orders', path: '/admin/orders' },
        { icon: Database, label: 'AI Price Prediction Logs', path: '/admin/ai-logs' },
        { icon: TrendingUp, label: 'Demand Forecast Reports', path: '/admin/forecast' },
        { icon: BarChart3, label: 'System Analytics', path: '/admin/analytics' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        authAPI.logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-['Inter',_sans-serif]">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-[#0f172a] text-slate-300">
                <div className="p-6 h-20 flex items-center border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white tracking-tight">AgroLink</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1 custom-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${Menu.name === 'isActive' ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Logout</span>
                    </button>
                    <div className="mt-4 px-4 py-3 bg-slate-800/40 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate lowercase">SYSTEM ADMIN</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@agrolink.ai'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search analytics, logs, users..."
                                className="bg-transparent border-none outline-none text-sm w-64 text-slate-600 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                    <aside className="fixed inset-y-0 left-0 w-72 bg-[#0f172a] flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-6 h-20 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <BrainCircuit className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-white">AgroLink Admin</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
