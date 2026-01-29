import React, { useState } from 'react';
import {
    Zap, Plus, Trash2, Edit2,
    Clock, ShieldCheck, AlertTriangle,
    Gavel, UserCheck, Package, Filter, Play
} from 'lucide-react';

interface Rule {
    id: number;
    name: string;
    description: string;
    condition: string;
    action: string;
    isActive: boolean;
    triggersToday: number;
    category: 'security' | 'market' | 'system';
}

const initialRules: Rule[] = [
    { id: 1, name: 'Flag Price Irregularities', description: 'Flag listings if price is >30% above AI baseline.', condition: 'Price > AI_Price * 1.3', action: 'Flag Review', isActive: true, triggersToday: 12, category: 'market' },
    { id: 2, name: 'Spam Protection', description: 'Block users with >50 contacts in 1h.', condition: 'Contacts > 50/hr', action: 'Block User', isActive: true, triggersToday: 2, category: 'security' },
    { id: 3, name: 'Latency Guard', description: 'Alert if response > 2s for 5 consecutive pings.', condition: 'Latency > 2k ms [n=5]', action: 'Critical Alert', isActive: false, triggersToday: 0, category: 'system' },
    { id: 4, name: 'Listing Quality', description: 'Hide listings with 3+ reports in 24h.', condition: 'Reports >= 3/24h', action: 'Unlist Item', isActive: true, triggersToday: 5, category: 'market' },
];

const RulesEngine: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>(initialRules);

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    };

    return (
        <div className="space-y-6 lg:space-y-8 font-['Outfit'] pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Automated Admin Actions</h2>
                    <p className="text-[var(--text-muted)] text-sm">Define rules to automate moderation, security, and market stability.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] rounded-[var(--radius-theme)] text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                    New Automation Rule
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Efficiency Gain" value="42.5h" sub="Saved today" icon={Zap} color="info" />
                <StatCard label="Auto-Actions" value="19" sub="Resolved today" icon={UserCheck} color="success" />
                <StatCard label="Violations" value="3" sub="Blocked (1h)" icon={AlertTriangle} color="warning" />
            </div>

            {/* Rules List */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-[var(--radius-theme)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-base)] flex items-center justify-between bg-[var(--bg-muted)]/10">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Active Automation Engine</h3>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <Filter className="w-3 h-3" /> Filter
                    </button>
                </div>
                <div className="divide-y divide-[var(--border-base)]">
                    {rules.map((rule) => (
                        <div key={rule.id} className={`p-6 transition-colors ${rule.isActive ? 'bg-transparent' : 'bg-[var(--bg-muted)]/20'}`}>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-2 rounded border ${rule.category === 'security' ? 'bg-red-50 text-[var(--status-error)] border-red-100' :
                                            rule.category === 'market' ? 'bg-emerald-50 text-[var(--status-success)] border-emerald-100' : 'bg-blue-50 text-[var(--status-info)] border-blue-100'
                                        }`}>
                                        <Gavel className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-[var(--text-primary)] text-sm">{rule.name}</h4>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${rule.isActive ? 'bg-emerald-50 text-[var(--status-success)] border-emerald-100' : 'bg-gray-100 text-[var(--text-muted)] border-gray-200'}`}>
                                                {rule.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] max-w-2xl">{rule.description}</p>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <div className="flex items-center gap-2 bg-[var(--bg-muted)] border border-[var(--border-base)] px-2 py-0.5 rounded">
                                                <span className="text-[9px] font-bold text-[var(--brand-primary)] uppercase">If</span>
                                                <code className="text-[11px] font-medium text-[var(--text-secondary)] font-mono">{rule.condition}</code>
                                            </div>
                                            <div className="flex items-center gap-2 bg-[var(--bg-muted)] border border-[var(--border-base)] px-2 py-0.5 rounded">
                                                <span className="text-[9px] font-bold text-[var(--status-success)] uppercase">Then</span>
                                                <code className="text-[11px] font-medium text-[var(--text-secondary)] font-mono">{rule.action}</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 pl-0 lg:pl-8 lg:border-l border-[var(--border-base)]">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Triggers</p>
                                        <p className="text-lg font-bold text-[var(--text-primary)]">{rule.triggersToday}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-red-50 rounded transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="mx-2 h-4 w-[1px] bg-[var(--border-base)]" />
                                        <button
                                            onClick={() => toggleRule(rule.id)}
                                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${rule.isActive ? 'bg-[var(--brand-primary)]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${rule.isActive ? 'translate-x-5.5' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-[var(--text-primary)] rounded-[var(--radius-theme)] p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-white/90">
                        <Play className="w-4 h-4 text-[var(--status-success)]" /> Automation Audit
                    </h3>
                    <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest">History</button>
                </div>
                <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between items-center py-2 border-b border-white/5 opacity-70">
                        <span className="text-white/40">10:42 AM</span>
                        <span className="text-blue-400">[Flag Price]</span>
                        <span className="flex-1 px-4 truncate text-white/80">Listing #9204 flagged for review</span>
                        <span className="text-[var(--status-success)]">Resolved</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5 opacity-70">
                        <span className="text-white/40">09:15 AM</span>
                        <span className="text-blue-400">[Spam Prot]</span>
                        <span className="flex-1 px-4 truncate text-white/80">User #442 temp-blocked (velocity limit)</span>
                        <span className="text-[var(--status-success)]">Auto-Done</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, sub, icon: Icon, color }: any) => {
    const colors: any = {
        success: 'text-[var(--status-success)]',
        info: 'text-[var(--brand-primary)]',
        warning: 'text-[var(--status-warning)]',
    };
    return (
        <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-base)] rounded-[var(--radius-theme)] flex items-center gap-4">
            <div className={`p-2 bg-[var(--bg-muted)] rounded border border-[var(--border-base)] ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
                    <p className="text-[10px] font-medium text-[var(--text-muted)]">{sub}</p>
                </div>
            </div>
        </div>
    );
}

export default RulesEngine;
