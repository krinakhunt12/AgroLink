import React from 'react';

interface MarketRateRowProps {
    label: string;
    value: string;
}

export const MarketRateRow: React.FC<MarketRateRowProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 transition-colors hover:bg-gray-50 text-stone-700">
            <span className="font-medium text-stone-600 tracking-tight">{label}</span>
            <span className="font-bold text-emerald-700 tabular-nums">{value}</span>
        </div>
    );
};
