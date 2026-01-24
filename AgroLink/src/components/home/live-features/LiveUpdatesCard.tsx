import React from 'react';
import { TrendingUp } from 'lucide-react';
import { MarketRateRow } from './MarketRateRow';

interface LiveUpdatesCardProps {
    title: string;
    liveLabel: string;
    rates: string[];
}

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/card';

export const LiveUpdatesCard: React.FC<LiveUpdatesCardProps> = ({ title, liveLabel, rates }) => {
    return (
        <Card className="bg-bg-surface text-text-primary rounded-lg overflow-hidden shadow-sm border border-border-base flex flex-col h-full">
            <CardHeader className="bg-bg-muted/30 backdrop-blur-sm p-6 border-b border-border-base flex flex-row justify-between items-center space-y-0">
                <CardTitle className="font-bold text-xl flex items-center gap-3 text-text-primary">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <TrendingUp className="text-brand-primary w-6 h-6" />
                    </div>
                    {title}
                </CardTitle>
                <span className="flex items-center gap-2 text-status-error text-[10px] font-black tracking-widest uppercase bg-status-error/10 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-status-error rounded-full"></span>
                    {liveLabel}
                </span>
            </CardHeader>


            <CardContent className="p-6 space-y-4 flex-grow">
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
            </CardContent>

            <CardFooter className="px-6 py-5 bg-bg-muted/20 border-t border-border-subtle text-[10px] text-text-muted font-black text-center uppercase tracking-[0.2em]">
                Data refreshed every 5 minutes
            </CardFooter>
        </Card>
    );
};
