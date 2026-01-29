import React, { useState } from 'react';
import {
    Activity, Cpu, HardDrive, Terminal, AlertTriangle, Server,
    Globe, Lock, RefreshCw,
    Zap, Database, ShieldAlert, Bug, BarChart3,
    CheckCircle2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

// --- Mock Data ---
const cpuData = [
    { time: '00:00', value: 42 }, { time: '04:00', value: 38 },
    { time: '08:00', value: 65 }, { time: '12:00', value: 58 },
    { time: '16:00', value: 72 }, { time: '20:00', value: 45 },
    { time: '23:59', value: 40 },
];

const apiMetrics = [
    { name: '/predict-price', method: 'POST', avgResponse: 142, success: 99.8, errors: 0.2, lastCheck: 'now' },
    { name: '/forecast-demand', method: 'GET', avgResponse: 210, success: 98.5, errors: 1.5, lastCheck: '2s ago' },
    { name: '/admin/login', method: 'POST', avgResponse: 85, success: 100, errors: 0, lastCheck: '5s ago' },
    { name: '/crop/listing', method: 'GET', avgResponse: 45, success: 99.9, errors: 0.1, lastCheck: '1s ago' },
];

const SystemHealth: React.FC = () => {
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

    return (
        <div className="space-y-6 lg:space-y-8 font-['Outfit'] pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">System Health & Infrastructure</h2>
                    <p className="text-[var(--text-muted)] text-sm italic">Internal Monitoring • Real-time Infrastructure Oversight</p>
                </div>
                <div className="flex items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border-base)] px-4 py-2 rounded-[var(--radius-theme)]">
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Last Synchronized</p>
                        <p className="text-xs font-mono text-[var(--status-success)]">{lastRefresh}</p>
                    </div>
                    <button
                        onClick={() => setLastRefresh(new Date().toLocaleTimeString())}
                        className="p-2 hover:bg-[var(--bg-muted)] rounded transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                </div>
            </div>

            {/* Health Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatusCard title="API Gateway" status="Healthy" value="42ms avg" icon={Globe} color="success" />
                <StatusCard title="Backend Server" status="Operational" value="v2.4.0" icon={Server} color="info" />
                <StatusCard title="ML Services" status="Warning" value="3/4 Online" icon={Zap} color="warning" />
                <StatusCard title="Database" status="Healthy" value="1.2ms" icon={Database} color="success" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Left: Resource Usage */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Server Load & Resource Usage</h3>
                                <p className="text-xs text-[var(--text-muted)]">Real-time CPU allocation trend</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--brand-primary)] bg-[var(--bg-muted)] px-2 py-1 rounded">
                                    <Activity className="w-3 h-3" /> CPU LOADS
                                </span>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cpuData}>
                                    <defs>
                                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide hide domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-theme)', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[var(--border-base)]">
                            <LoadStat label="CPU" value="48%" icon={Cpu} />
                            <LoadStat label="Memory" value="6.2GB" icon={HardDrive} />
                            <LoadStat label="Disk" value="124MB/s" icon={BarChart3} />
                            <LoadStat label="Network" value="2.8k req" icon={Activity} />
                        </div>
                    </div>

                    {/* API Monitoring Table */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--border-base)]">
                            <h3 className="font-bold text-[var(--text-primary)]">Endpoint Performance</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[var(--bg-muted)]/50 border-b border-[var(--border-base)]">
                                        <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Endpoint</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Avg Resp</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Success</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Errors</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-base)]">
                                    {apiMetrics.map((api, i) => (
                                        <tr key={i} className="hover:bg-[var(--bg-muted)]/20 transition-colors odd:bg-[var(--bg-surface)] even:bg-[var(--bg-muted)]/10">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-[var(--text-primary)] font-mono">{api.name}</span>
                                                    <span className="text-[10px] font-bold text-[var(--text-muted)]">{api.method}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-sm">{api.avgResponse}ms</td>
                                            <td className="px-6 py-4 text-center text-sm font-bold text-[var(--status-success)]">{api.success}%</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${api.errors > 1 ? 'bg-red-50 text-[var(--status-error)]' : 'bg-gray-50 text-[var(--text-muted)]'}`}>
                                                    {api.errors}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right: Security & Logs */}
                <div className="space-y-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] p-6">
                        <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-[var(--status-error)]" /> Security Panel
                        </h3>
                        <div className="space-y-4">
                            <SecurityStat label="Blocked IPs" value="12" sub="Last 24h" icon={Lock} />
                            <SecurityStat label="Login Failures" value="3" sub="Admin only" icon={Bug} />
                        </div>
                    </div>

                    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--border-base)] flex items-center justify-between">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-[var(--brand-primary)]" /> System Logs
                            </h3>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse"></span>
                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Live</span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <LogItem service="AUTH" msg="Admin login success" type="info" />
                            <LogItem service="ML" msg="Inference timeout: crop#89" type="error" />
                            <LogItem service="DB" msg="Query optimized in 1.2s" type="info" />
                            <LogItem service="API" msg="New listing created: Rice" type="info" />
                        </div>
                        <button className="w-full py-3 bg-[var(--bg-muted)]/50 text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-widest hover:bg-[var(--bg-muted)]">
                            Export Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---
const StatusCard = ({ title, status, value, icon: Icon, color }: any) => {
    const statusColors: any = {
        success: 'text-[var(--status-success)] bg-emerald-50 border-emerald-100',
        warning: 'text-[var(--status-warning)] bg-amber-50 border-amber-100',
        error: 'text-[var(--status-error)] bg-red-50 border-red-100',
        info: 'text-[var(--status-info)] bg-blue-50 border-blue-100',
    };
    return (
        <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-base)] rounded-[var(--radius-theme)] flex items-start gap-4">
            <div className={`p-2.5 rounded-lg border ${statusColors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{title}</p>
                <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${color === 'success' ? 'bg-[var(--status-success)]' : color === 'warning' ? 'bg-[var(--status-warning)]' : 'bg-[var(--status-info)]'}`}></span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{status}</span>
                </div>
            </div>
        </div>
    );
};

const LoadStat = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col items-center">
        <Icon className="w-4 h-4 text-[var(--text-muted)] mb-2" />
        <span className="text-sm font-bold text-[var(--text-primary)]">{value}</span>
        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase mt-1 tracking-tighter">{label}</span>
    </div>
);

const SecurityStat = ({ label, value, sub, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-muted)]/30 border border-[var(--border-base)] rounded">
        <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-[var(--text-muted)]" />
            <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">{label}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{sub}</p>
            </div>
        </div>
        <span className="text-lg font-bold text-[var(--text-primary)]">{value}</span>
    </div>
);

const LogItem = ({ service, msg, type }: any) => (
    <div className="flex items-start gap-2 text-[11px] font-mono leading-tight">
        <span className={`shrink-0 w-1 h-1 mt-1.5 rounded-full ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
        <span className="text-[var(--text-muted)] uppercase font-bold shrink-0">[{service}]</span>
        <span className="text-[var(--text-secondary)] break-all">{msg}</span>
    </div>
);

export default SystemHealth;
