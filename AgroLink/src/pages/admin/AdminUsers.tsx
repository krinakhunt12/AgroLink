import React, { useState } from 'react';
import {
    Search, Filter, MoreVertical, Shield,
    ShieldOff, Mail, Phone, MapPin, ExternalLink,
    ChevronLeft, ChevronRight, UserPlus, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminUsersProps {
    type: 'farmer' | 'buyer';
}

const AdminUsers: React.FC<AdminUsersProps> = ({ type }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock user data
    const users = [
        { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', location: 'Punjab', status: 'active', joined: 'Jan 12, 2024' },
        { id: '2', name: 'Amit Patel', email: 'amit@example.com', phone: '9876543221', location: 'Gujarat', status: 'blocked', joined: 'Feb 05, 2024' },
        { id: '3', name: 'Suresh Raina', email: 'suresh@example.com', phone: '9876543232', location: 'UP', status: 'active', joined: 'Mar 10, 2024' },
        { id: '4', name: 'Vijay Singh', email: 'vijay@example.com', phone: '9876543243', location: 'Haryana', status: 'active', joined: 'Mar 15, 2024' },
        { id: '5', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543254', location: 'Maharashtra', status: 'active', joined: 'Apr 02, 2024' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{type}s Management</h2>
                    <p className="text-slate-500 font-medium text-sm">Review, verify and manage {type} accounts on the platform.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] rounded-xl text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
                    <UserPlus className="w-4 h-4" />
                    Add New {type === 'farmer' ? 'Farmer' : 'Buyer'}
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={`Search ${type}s by name, email, or phone...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter className="w-4 h-4" />
                        Status: All
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Location: All
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">User Info</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Contact</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Location</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Joined</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={user.id}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-400">ID: AUR-{user.id}042</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail className="w-3 h-3 text-slate-300" />
                                                <span className="text-xs font-medium">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone className="w-3 h-3 text-slate-300" />
                                                <span className="text-xs font-medium">+{user.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <MapPin className="w-3 h-3 text-slate-300" />
                                            <span className="text-xs font-bold">{user.location}, India</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 font-medium text-xs">
                                        {user.joined}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                                                className={`p-2 rounded-lg border transition-all ${user.status === 'active'
                                                        ? 'text-amber-600 border-amber-100 bg-amber-50 hover:bg-amber-100'
                                                        : 'text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100'
                                                    }`}
                                            >
                                                {user.status === 'active' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                            </button>
                                            <button className="p-2 rounded-lg text-slate-600 border border-slate-200 bg-white hover:bg-slate-50">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg text-red-600 border border-red-100 bg-red-50 hover:bg-red-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button className="lg:hidden p-1 rounded-md hover:bg-slate-100">
                                            <MoreVertical className="w-5 h-5 text-slate-400" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Showing 1 to 5 of 12,840 {type}s</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[1, 2, 3, '...', 12].map((p, i) => (
                            <button key={i} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-200'}`}>
                                {p}
                            </button>
                        ))}
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
