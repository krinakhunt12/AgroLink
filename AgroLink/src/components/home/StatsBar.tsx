import React from 'react';
import { Users, ShoppingBag, MapPin, IndianRupee } from 'lucide-react';
import { Card } from '../ui/card';
interface Stat {
    value: string;
    label: string;
    icon: string;
}

interface StatsBarProps {
    stats: Stat[];
}

const iconMap = {
    Users,
    ShoppingBag,
    MapPin,
    IndianRupee
};


export const StatsBar: React.FC<StatsBarProps> = React.memo(({ stats }) => {
    return (
        <div className="relative -mt-10 z-30 max-w-7xl mx-auto px-4">
            <Card className="bg-bg-surface rounded-2xl shadow-theme grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-8 border border-border-subtle">
                {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon as keyof typeof iconMap];
                    return (
                        <div key={index} className="flex flex-col items-center border-r border-border-subtle last:border-0 p-2">
                            {Icon && <Icon className="w-8 h-8 text-brand-primary mb-2" />}
                            <span className="text-3xl font-black text-text-primary">{stat.value}</span>
                            <span className="text-xs text-text-muted font-bold uppercase tracking-[0.2em] mt-1">{stat.label}</span>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
});

StatsBar.displayName = 'StatsBar';
