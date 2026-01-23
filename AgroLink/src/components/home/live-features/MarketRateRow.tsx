import React from 'react';

interface MarketRateRowProps {
    label: string;
    value: string;
}

export const MarketRateRow: React.FC<MarketRateRowProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between items-center bg-bg-muted/50 p-5 rounded-2xl border border-border-subtle/30 transition-all hover:bg-bg-muted hover:border-brand-primary/20 group">
            <span className="font-bold text-text-secondary tracking-tight group-hover:text-text-primary transition-colors">{label}</span>
            <span className="font-black text-status-success tabular-nums text-lg">{value}</span>
        </div>
    );
};
