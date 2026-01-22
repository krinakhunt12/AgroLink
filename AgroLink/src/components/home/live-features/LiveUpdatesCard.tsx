import React from 'react';
import { TrendingUp } from 'lucide-react';
import { MarketRateRow } from './MarketRateRow';

interface LiveUpdatesCardProps {
    title: string;
    liveLabel: string;
    rates: string[];
}

export const LiveUpdatesCard: React.FC<LiveUpdatesCardProps> = ({ title, liveLabel, rates }) => {
    return (
        <div className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full">
            <div className="bg-stone-50/80 backdrop-blur-sm p-5 border-b border-stone-100 flex justify-between items-center">
                <span className="font-bold text-lg flex items-center gap-2 text-stone-800">
                    <TrendingUp className="text-emerald-600 w-5 h-5" />
                    {title}
                </span>
                <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold tracking-wider uppercase">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    {liveLabel}
                </span>
            </div>

            <div className="p-6 space-y-3 flex-grow">
                {rates.map((rate, i) => {
                    const [label, value] = rate.split(':');
                    return (
                        <MarketRateRow
                            key={i}
                            label={label?.trim()}
                            value={value?.trim()}
                        />
                    );
                })}
            </div>

            <div className="px-6 py-4 bg-stone-50/30 border-t border-stone-50 text-[10px] text-stone-400 font-medium text-center uppercase tracking-widest">
                Data refreshed every 5 minutes
            </div>
        </div>
    );
};
