import React, { useState } from 'react';
import {
    BrainCircuit, Activity, TrendingUp, RefreshCw,
    ShieldAlert, Database, Info, Download, Filter,
    ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

// --- Mock Data ---
const accuracyData = [
    { month: 'Aug', accuracy: 92 }, { month: 'Sep', accuracy: 94 },
    { month: 'Oct', accuracy: 93 }, { month: 'Nov', accuracy: 91 },
    { month: 'Dec', accuracy: 88 }, { month: 'Jan', accuracy: 84 },
];

const modelInventory = [
    { id: 1, name: 'Price Predictor v4.2', status: 'Warning', drift: 'High', accuracy: '84.2%', lastTrain: '45d ago' },
    { id: 2, name: 'Demand Forecaster v2.1', status: 'Healthy', drift: 'Low', accuracy: '91.5%', lastTrain: '12d ago' },
    { id: 3, name: 'Crop Advisor v1.0', status: 'Healthy', drift: 'Minimal', accuracy: '96.8%', lastTrain: '5d ago' },
];

const MLOpsDashboard: React.FC = () => {
    const [selectedModel, setSelectedModel] = useState(modelInventory[0]);

    return (
        <div className="space-y-6 lg:space-y-8 font-['Outfit'] pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">AI Monitoring & ML Ops</h2>
                    <p className="text-[var(--text-muted)] text-sm">Tracking performance drift and model retraining cycles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Retrain All
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] rounded-[var(--radius-theme)] text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" />
                        Report
                    </button>
                </div>
            </div>

            {/* Performance Drift Alert */}
            {parseFloat(selectedModel.accuracy) < 85 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-[var(--radius-theme)] flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-[var(--status-warning)] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-amber-900">Drift Detected: {selectedModel.name}</h4>
                        <p className="text-xs text-amber-800 mt-0.5">Model accuracy dropped below 85%. Retraining is recommended to ensure prediction stability.</p>
                        <button className="mt-3 text-xs font-bold text-amber-900 uppercase tracking-widest hover:underline">Trigger Retraining Now →</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Left: Model Inventory */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">Production Models</h3>
                    {modelInventory.map((model) => (
                        <div
                            key={model.id}
                            onClick={() => setSelectedModel(model)}
                            className={`p-5 rounded-[var(--radius-theme)] border cursor-pointer transition-all ${selectedModel.id === model.id
                                    ? 'bg-[var(--bg-muted)] border-[var(--brand-primary)]'
                                    : 'bg-[var(--bg-surface)] border-[var(--border-base)] hover:border-[var(--text-muted)]'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${model.status === 'Healthy' ? 'bg-emerald-50 text-[var(--status-success)] border-emerald-100' : 'bg-red-50 text-[var(--status-error)] border-red-100'
                                    }`}>
                                    {model.status}
                                </span>
                                <span className="text-[11px] font-medium text-[var(--text-muted)]">{model.lastTrain}</span>
                            </div>
                            <h4 className="font-bold text-[var(--text-primary)] text-sm">{model.name}</h4>
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border-base)]">
                                <div>
                                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Accuracy</p>
                                    <p className="text-lg font-bold text-[var(--text-primary)]">{model.accuracy}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Drift</p>
                                    <p className={`text-lg font-bold ${model.drift === 'High' ? 'text-[var(--status-error)]' : 'text-[var(--status-success)]'}`}>{model.drift}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Detailed Tracking */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Accuracy Trend over Time</h3>
                                <p className="text-xs text-[var(--text-muted)]">Monitoring drift for {selectedModel.name}</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={accuracyData}>
                                    <defs>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fontBold: 500, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis hide domain={[70, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-theme)', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="accuracy" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Error Stats */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] p-6">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[var(--status-info)]" /> Error Metrics
                            </h3>
                            <div className="space-y-5">
                                <MetricBar label="RMSE (Root Mean Sq Error)" val={4.2} target={5.0} unit="₹" />
                                < MetricBar label="MAPE (Mean Abs % Error)" val={2.8} target={3.5} unit="%" />
                                <MetricBar label="R-Squared Score" val={94} target={90} unit="pts" invert />
                            </div>
                        </div>

                        {/* Feature Weights */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] p-6">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                <Database className="w-4 h-4 text-[var(--brand-primary)]" /> Feature Importance
                            </h3>
                            <div className="space-y-4">
                                <WeightItem label="Historical Prices" pct={42} />
                                <WeightItem label="Seasonal Trends" pct={28} />
                                <WeightItem label="Market Arrivals" pct={18} />
                                <WeightItem label="Weather Indices" pct={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---
const MetricBar = ({ label, val, target, unit, invert }: any) => {
    const isHealthy = invert ? val >= target : val <= target;
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5 ">
                <span className="text-[11px] font-medium text-[var(--text-muted)]">{label}</span>
                <span className="text-[11px] font-bold text-[var(--text-primary)]">{val}{unit} / <span className="text-[var(--text-muted)] font-normal">{target}{unit}</span></span>
            </div>
            <div className="h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden border border-[var(--border-base)]">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${isHealthy ? 'bg-[var(--brand-primary)]' : 'bg-[var(--status-error)]'}`}
                    style={{ width: `${(val / target) * 100 > 100 ? 100 : (val / target) * 100}%` }}
                />
            </div>
        </div>
    );
};

const WeightItem = ({ label, pct }: any) => (
    <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium text-[var(--text-muted)] w-28 shrink-0">{label}</span>
        <div className="flex-1 h-1 bg-[var(--bg-muted)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--text-primary)] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] font-bold text-[var(--text-primary)] w-8 text-right">{pct}%</span>
    </div>
);

export default MLOpsDashboard;
