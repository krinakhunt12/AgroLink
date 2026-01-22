import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface LiveFeatureItemProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export const LiveFeatureItem: React.FC<LiveFeatureItemProps> = ({
    title,
    description,
    icon: Icon
}) => {
    return (
        <div className="flex gap-5 group py-4 transition-all border-b border-white/5 last:border-0">
            <div className="bg-white/10 rounded-2xl p-3 h-14 w-14 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-300">
                <Icon size={24} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-emerald-100/60 mt-1.5 leading-relaxed text-sm lg:text-base max-w-md">
                    {description}
                </p>
            </div>
        </div>
    );
};
