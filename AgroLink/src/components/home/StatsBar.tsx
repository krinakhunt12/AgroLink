import React from 'react';
import { Users, ShoppingBag, MapPin, IndianRupee } from 'lucide-react';

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
            <div className="bg-white rounded-2xl shadow-xl shadow-green-900/5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-8 border border-gray-100">
                {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon as keyof typeof iconMap];
                    return (
                        <div key={index} className="flex flex-col items-center border-r border-gray-100 last:border-0 p-2">
                            {Icon && <Icon className="w-8 h-8 text-green-600 mb-2" />}
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

StatsBar.displayName = 'StatsBar';
