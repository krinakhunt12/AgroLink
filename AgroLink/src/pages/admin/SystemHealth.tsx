import React, { useState, useEffect } from 'react';
import {
    Activity, Cpu, HardDrive, Terminal, AlertTriangle, Server,
    Globe, Lock, CheckCircle2, AlertCircle, Clock, RefreshCw,
    Zap, Database, ShieldAlert, Bug, BarChart3, ArrowUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, BarChart, Bar
} from 'recharts';

// --- Mock Data Generators ---
const generateTimeSeriesData = (points: number, min: number, max: number) => {
    return Array.from({ length: points }, (_, i) => ({
        time: `${i}:00`,
        value: Math.floor(Math.random() * (max - min + 1)) + min
    }));
};

const cpuData = generateTimeSeriesData(20, 20, 60);
const memoryData = generateTimeSeriesData(20, 40, 85);
const requestData = generateTimeSeriesData(20, 100, 500);

const apiMetrics = [
    { name: '/predict-price', method: 'POST', avgResponse: 142, success: 99.8, errors: 0.2, lastCheck: 'now', trend: [120, 150, 130, 160, 142] },
    { name: '/forecast-demand', method: 'GET', avgResponse: 210, success: 98.5, errors: 1.5, lastCheck: '2s ago', trend: [180, 220, 250, 200, 210] },
    { name: '/admin/login', method: 'POST', avgResponse: 85, success: 100, errors: 0, lastCheck: '5s ago', trend: [80, 90, 85, 82, 85] },
    { name: '/crop/listing', method: 'GET', avgResponse: 45, success: 99.9, errors: 0.1, lastCheck: '1s ago', trend: [40, 50, 45, 42, 45] },
    { name: '/chat/messages', method: 'POST', avgResponse: 62, success: 99.5, errors: 0.5, lastCheck: '8s ago', trend: [60, 70, 65, 58, 62] },
];

const logs = [
    { id: 1, type: 'info', service: 'AUTH', message: 'Admin login successful: admin@agrolink.ai', time: '2 mins ago' },
    { id: 2, type: 'error', service: 'ML-PREDICT', message: 'Inference timeout for crop ID: 8924', time: '5 mins ago' },
    { id: 3, type: 'warning', service: 'DB', message: 'Long running query detected (1.2s)', time: '12 mins ago' },
    { id: 4, type: 'info', service: 'API', message: 'New listing created: Organic Cotton', time: '15 mins ago' },
    { id: 5, type: 'error', service: 'SECURITY', message: 'Failed login attempt from 192.168.1.45', time: '22 mins ago' },
    { id: 6, type: 'info', service: 'ML-FORECAST', message: 'Model refresh completed successfully', time: '40 mins ago' },
];

const SystemHealth: React.FC = () => {
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setLastRefresh(new Date().toLocaleTimeString());
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] p-8 rounded-[32px] text-white shadow-2xl">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">System Health & Monitoring</h2>
                    </div>
                    <p className="text-slate-400 mt-1 font-medium italic">Internal System Metrics • Real-time Infrastructure Oversight</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Last Synchronized</p>
                        <p className="text-sm font-mono text-emerald-400">{lastRefresh}</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className={`p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700 group ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5 text-slate-300 group-hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Health Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="API Status"
                    status="Healthy"
                    value="42ms avg"
                    icon={Globe}
                    color="emerald"
                    details="12 endpoints online"
                />
                <StatusCard
                    title="Backend Server"
                    status="Running"
                    value="v2.4.0-stable"
                    icon={Server}
                    color="blue"
                    details="Uptime: 14d 6h 22m"
                />
                <StatusCard
                    title="ML Services"
                    status="Warning"
                    value="3/4 Online"
                    icon={Zap}
                    color="amber"
                    details="Forecast model latency high"
                />
                <StatusCard
                    title="Database"
                    status="Healthy"
                    value="1.2ms latency"
                    icon={Database}
                    color="indigo"
                    details="MongoDB Cluster: Primary"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: Charts & Metrics */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Server Load Section */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Server Load & Resource Usage</h3>
                                <p className="text-sm text-slate-500 font-medium">Real-time CPU and Memory allocation</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> CPU
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Memory
                                </span>
                            </div>
                        </div>

                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cpuData}>
                                    <defs>
                                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-50">
                            <LoadMetric label="CPU Usage" value="48%" subValue="8 Cores" icon={Cpu} />
                            <LoadMetric label="Memory Usage" value="6.2GB" subValue="Max 16GB" icon={HardDrive} />
                            <LoadMetric label="Disk I/O" value="124MB/s" subValue="92% Free" icon={BarChart3} />
                            <LoadMetric label="Connections" value="2,840" subValue="+12% / min" icon={Activity} />
                        </div>
                    </div>

                    {/* API Performance Section */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="font-bold text-slate-900 text-lg">API Performance Monitoring</h3>
                            <p className="text-sm text-slate-500 font-medium">Endpoint responsiveness and error rates</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Endpoint</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Resp</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Error %</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Checked</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {apiMetrics.map((api, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 font-mono italic">{api.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{api.method}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`text-sm font-black ${api.avgResponse > 200 ? 'text-amber-600' : 'text-slate-900'}`}>{api.avgResponse}ms</span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-emerald-600">{api.success}%</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black ${api.errors > 1 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    {api.errors}%
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-mono text-slate-400 uppercase">
                                                {api.lastCheck}
                                            </td>
                                            <td className="px-8 py-5 w-32">
                                                <div className="h-8 flex items-end gap-0.5">
                                                    {api.trend.map((val, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-2 rounded-t-sm ${api.errors > 1 ? 'bg-rose-400/50' : 'bg-blue-400/50'}`}
                                                            style={{ height: `${(val / 250) * 100}%` }}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI health & Logs */}
                <div className="space-y-8">

                    {/* ML Model Service Monitoring */}
                    <div className="bg-[#0f172a] p-8 rounded-[32px] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-24 h-24" />
                        </div>
                        <h3 className="font-bold text-lg relative z-10">AI Model Health</h3>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">Real-time diagnostic metrics for LLM & ML models</p>

                        <div className="space-y-6 relative z-10">
                            <AiMetric
                                label="Price Prediction v4.2"
                                value="Online"
                                stat="4.8k req/day"
                                color="emerald"
                            />
                            <AiMetric
                                label="Demand Forecast v2.1"
                                value="Latency Alert"
                                stat="Refreshed 4h ago"
                                color="amber"
                            />
                            <AiMetric
                                label="Agro-Advisor (Gemini)"
                                value="Online"
                                stat="99.9% Up"
                                color="blue"
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-2 gap-4 relative z-10">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg Inference</p>
                                <p className="text-xl font-bold font-mono">1.24s</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Model Drift</p>
                                <p className="text-xl font-bold font-mono text-emerald-400">Low</p>
                            </div>
                        </div>
                    </div>

                    {/* Security & Access Panel */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-50 rounded-lg">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                            </div>
                            <h3 className="font-bold text-slate-900">Security & Access</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">Failed Admin Logins</p>
                                        <p className="text-[10px] text-slate-500">Last 24 hours</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-rose-600">3</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <Bug className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">Suspicious Attempts</p>
                                        <p className="text-[10px] text-slate-500">IP geo-fenced</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-slate-900">12</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent System Alerts */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-blue-500" /> System Logs
                            </h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase">Live Tail</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${log.type === 'error' ? 'bg-rose-500' :
                                                log.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.service}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium font-mono">{log.time}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700 leading-relaxed font-mono truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:break-words">
                                        {log.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 text-[10px] font-black text-blue-600 uppercase bg-slate-50/50 hover:bg-blue-600 hover:text-white transition-all">
                            View Full Log Archive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const StatusCard = ({ title, status, value, icon: Icon, color, details }: any) => {
    const colors: any = {
        emerald: "bg-emerald-500 hover:bg-emerald-600 text-emerald-50",
        blue: "bg-blue-600 hover:bg-blue-700 text-blue-50",
        amber: "bg-amber-500 hover:bg-amber-600 text-amber-50",
        indigo: "bg-indigo-600 hover:bg-indigo-700 text-indigo-50",
    };

    const iconColors: any = {
        emerald: "bg-emerald-400/20",
        blue: "bg-blue-400/20",
        amber: "bg-amber-400/20",
        indigo: "bg-indigo-400/20",
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`p-6 rounded-[28px] ${colors[color]} border-none shadow-lg transition-all cursor-default relative overflow-hidden group`}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className={`p-3 rounded-2xl ${iconColors[color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-black/10 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
                </div>
            </div>
            <div className="mt-8 relative z-10">
                <h3 className="text-[10px] uppercase tracking-widest font-black opacity-70 leading-none">{title}</h3>
                <p className="text-2xl font-black mt-1 leading-none">{value}</p>
                <p className="text-xs font-medium mt-2 opacity-80 italic">{details}</p>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-700" />
        </motion.div>
    );
};

const LoadMetric = ({ label, value, subValue, icon: Icon }: any) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-xl font-black text-slate-900 font-mono tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase">{subValue}</p>
    </div>
);

const AiMetric = ({ label, value, stat, color }: any) => {
    const statusColors: any = {
        emerald: 'bg-emerald-500 text-emerald-500',
        amber: 'bg-amber-500 text-amber-500',
        blue: 'bg-blue-500 text-blue-500',
    };

    return (
        <div className="group/item">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors">{label}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    color === 'amber' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {value}
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: color === 'amber' ? '70%' : '95%' }}
                    className={`h-full ${statusColors[color].split(' ')[0]} rounded-full opacity-80`}
                />
            </div>
            <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase group-hover/item:text-slate-400">{stat}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Latency: {color === 'amber' ? ' высокую' : 'Low'}</span>
            </div>
        </div>
    );
};

export default SystemHealth;
