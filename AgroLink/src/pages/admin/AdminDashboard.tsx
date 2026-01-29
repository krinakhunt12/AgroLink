import React from 'react';
import {
    Users, UserCheck, Package, ShoppingCart,
    ArrowUpRight, ArrowDownRight, BrainCircuit,
    Clock, RefreshCw, Filter, Download, Zap, AlertTriangle,
    ShieldAlert
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
    // Mock data
    const anomalies = [
        { id: 1, title: 'Tomato Price Spike', desc: 'Price jumped 42% in 24h deviates from AI baseline.', severity: 'critical', time: '12m ago' },
        { id: 2, title: 'Suspicious Activity', desc: 'Buyer #442 contact pattern matches bulk-spam bot.', severity: 'warning', time: '1h ago' },
        { id: 3, title: 'Model Drift', desc: 'Rice prediction RMSE exceeded 5% threshold.', severity: 'info', time: '3h ago' },
    ];

    const stats = [
        { label: 'Total Farmers', value: '12,840', change: '+12%', isPositive: true, icon: Users },
        { label: 'Total Buyers', value: '4,210', change: '+5.4%', isPositive: true, icon: UserCheck },
        { label: 'Active Listings', value: '8,924', change: '-2%', isPositive: false, icon: Package },
        { label: 'Transactions', value: '₹45.2M', change: '+18.2%', isPositive: true, icon: ShoppingCart },
    ];

    const aiPredictions = [
        { crop: 'Wheat (Punjab Special)', predicted: '2,450', actual: '2,420', error: '1.2%', status: 'Healthy', time: '2 mins ago' },
        { crop: 'Cotton (Short Staple)', predicted: '7,100', actual: '7,400', error: '4.1%', status: 'Warning', time: '15 mins ago' },
        { crop: 'Rice (Basmati)', predicted: '4,800', actual: '4,790', error: '0.2%', status: 'Healthy', time: '42 mins ago' },
        { crop: 'Turmeric (Erode)', predicted: '12,500', actual: '11,800', error: '5.6%', status: 'Attention', time: '1 hour ago' },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 font-['Outfit']">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">System Overview</h2>
                    <p className="text-[var(--text-muted)] text-sm">Real-time Agro-Market diagnostics and system performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors">
                        <Filter className="w-4 h-4" />
                        Date Range
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] rounded-[var(--radius-theme)] text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-[var(--bg-surface)] p-6 rounded-[var(--radius-theme)] border border-[var(--border-base)] flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-[var(--bg-muted)] rounded text-[var(--brand-primary)]">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}`}>
                                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Anomalies & Intelligence */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-base)] flex items-center justify-between bg-[var(--bg-muted)]/30">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-[var(--status-error)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">AI Anomaly Intelligence</h3>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--status-error)] bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest">
                        3 Active Alerts
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-base)]">
                    {anomalies.map((anno) => (
                        <div key={anno.id} className="p-5 hover:bg-[var(--bg-muted)]/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${anno.severity === 'critical' ? 'bg-red-50 text-[var(--status-error)] border border-red-100' :
                                        anno.severity === 'warning' ? 'bg-amber-50 text-[var(--status-warning)] border border-amber-100' :
                                            'bg-blue-50 text-[var(--status-info)] border border-blue-100'
                                    }`}>
                                    {anno.severity}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)] font-medium">{anno.time}</span>
                            </div>
                            <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">{anno.title}</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{anno.desc}</p>
                            <button className="mt-4 text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-wider hover:underline">
                                Investigate →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Prediction Table */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-base)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="w-5 h-5 text-[var(--brand-primary)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">AI Price Prediction Monitoring</h3>
                    </div>
                    <RefreshCw className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--brand-primary)] cursor-pointer transition-colors" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-muted)]/50 border-b border-[var(--border-base)]">
                                <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Crop Name</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Predicted (₹)</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Market Actual</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Refreshed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-base)]">
                            {aiPredictions.map((row, idx) => (
                                <tr key={idx} className="hover:bg-[var(--bg-muted)]/30 transition-colors odd:bg-[var(--bg-surface)] even:bg-[var(--bg-muted)]/10">
                                    <td className="px-6 py-4 font-semibold text-[var(--text-primary)] text-sm">{row.crop}</td>
                                    <td className="px-6 py-4 text-right font-mono text-sm text-[var(--text-secondary)]">₹{row.predicted}</td>
                                    <td className="px-6 py-4 text-right font-mono text-sm text-[var(--text-primary)] font-bold">₹{row.actual}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${row.status === 'Healthy' ? 'bg-emerald-50 text-[var(--status-success)] border-emerald-100' :
                                                row.status === 'Warning' ? 'bg-amber-50 text-[var(--status-warning)] border-amber-100' :
                                                    'bg-blue-50 text-[var(--status-info)] border-blue-100'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] text-[var(--text-muted)]">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {row.time}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 bg-[var(--bg-muted)]/30 text-center border-t border-[var(--border-base)]">
                    <button className="text-[11px] font-bold text-[var(--brand-primary)] hover:underline uppercase tracking-widest">
                        View Audit Log
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
