import React from 'react';
import {
    Users, UserCheck, Package, ShoppingCart,
    ArrowUpRight, ArrowDownRight, BrainCircuit,
    Clock, RefreshCw, Filter, Download, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
    // Mock data for KPI cards
    const stats = [
        { label: 'Total Farmers', value: '12,840', change: '+12%', isPositive: true, icon: Users, color: 'blue' },
        { label: 'Total Buyers', value: '4,210', change: '+5.4%', isPositive: true, icon: UserCheck, color: 'indigo' },
        { label: 'Active Listings', value: '8,924', change: '-2%', isPositive: false, icon: Package, color: 'emerald' },
        { label: 'Transactions', value: '₹45.2M', change: '+18.2%', isPositive: true, icon: ShoppingCart, color: 'violet' },
    ];

    // Mock data for AI Prediction Table
    const aiPredictions = [
        { crop: 'Wheat (Punjab Special)', predicted: '2,450', actual: '2,420', error: '1.2%', status: 'highly-accurate', time: '2 mins ago' },
        { crop: 'Cotton (Short Staple)', predicted: '7,100', actual: '7,400', error: '4.1%', status: 'accurate', time: '15 mins ago' },
        { crop: 'Rice (Basmati)', predicted: '4,800', actual: '4,790', error: '0.2%', status: 'highly-accurate', time: '42 mins ago' },
        { crop: 'Turmeric (Erode)', predicted: '12,500', actual: '11,800', error: '5.6%', status: 'deviation', time: '1 hour ago' },
        { crop: 'Onion (Red)', predicted: '3,200', actual: '3,150', error: '1.5%', status: 'highly-accurate', time: '3 hours ago' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h2>
                    <p className="text-slate-500 font-medium">Monitoring real-time Agro-Market pulse and AI diagnostic logs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-white transition-colors border border-slate-100`}>
                                <stat.icon className={`w-6 h-6 text-slate-900`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4 relative z-10">
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Section - Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Simulated Chart 1: Market Activity */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900">Market Activity</h3>
                            <p className="text-xs text-slate-400 font-medium">Daily listings vs Transactions</p>
                        </div>
                        <select className="bg-slate-50 border-none outline-none text-xs font-bold text-slate-500 px-3 py-1 rounded-lg">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* Simplified Visual Representation of a Line Chart */}
                    <div className="h-64 flex items-end gap-2 relative">
                        <div className="absolute inset-0 flex flex-col justify-between py-2 overflow-hidden pointer-events-none">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-slate-50"></div>)}
                        </div>
                        {[65, 45, 75, 55, 90, 70, 85].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                                <div className="w-full bg-slate-100 rounded-t-lg h-full overflow-hidden flex flex-col justify-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className="w-full bg-blue-600 opacity-80 group-hover:opacity-100 transition-opacity rounded-t-lg shadow-[0_-4px_10px_rgba(37,99,235,0.2)]"
                                    ></motion.div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simulated Chart 2: Top Traded Crops */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900">Demand Heatmap</h3>
                            <p className="text-xs text-slate-400 font-medium">Top categories by volume</p>
                        </div>
                        <RefreshCw className="w-4 h-4 text-slate-300 hover:text-blue-500 cursor-pointer" />
                    </div>
                    <div className="space-y-5">
                        {[
                            { name: 'Cereals', val: 88, color: 'bg-blue-600' },
                            { name: 'Vegetables', val: 72, color: 'bg-indigo-500' },
                            { name: 'Fruits', val: 45, color: 'bg-violet-500' },
                            { name: 'Spices', val: 63, color: 'bg-slate-900' },
                            { name: 'Oilseeds', val: 31, color: 'bg-slate-400' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-600">{item.name}</span>
                                    <span className="text-slate-900">{item.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.val}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full ${item.color} rounded-full`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Monitoring Section */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                            <BrainCircuit className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">AI Price Prediction Monitoring</h3>
                            <p className="text-xs text-slate-400 font-medium">Real-time model accuracy vs Market reality</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Models: Healthy</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Crop Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Predicted (₹/kg)</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Market Actual</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Error %</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {aiPredictions.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 font-bold text-slate-800 text-sm">{row.crop}</td>
                                    <td className="px-8 py-5 text-right font-mono text-sm text-slate-600">₹{row.predicted}</td>
                                    <td className="px-8 py-5 text-right font-mono text-sm text-slate-900">₹{row.actual}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${parseFloat(row.error) < 2 ? 'text-emerald-600 bg-emerald-50' :
                                                parseFloat(row.error) < 5 ? 'text-blue-600 bg-blue-50' :
                                                    'text-amber-600 bg-amber-50'
                                            }`}>
                                            {row.error}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'highly-accurate' ? 'bg-emerald-500' :
                                                    row.status === 'accurate' ? 'bg-blue-500' : 'bg-amber-500'
                                                }`}></div>
                                            <span className="text-xs font-medium text-slate-500 capitalize">{row.status.replace('-', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-400 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {row.time}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                        View Complete Prediction Audit Trail
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
