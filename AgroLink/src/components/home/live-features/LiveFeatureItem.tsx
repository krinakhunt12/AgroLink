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
        <div className="flex gap-6 group py-6 transition-all border-b border-border-subtle/10 last:border-0 hover:translate-x-1 transition-transform">
            <div className="bg-brand-primary/10 rounded-[20px] p-4 h-16 w-16 flex items-center justify-center shrink-0 border border-brand-primary/10 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/30 transition-all duration-500 shadow-sm">
                <Icon size={28} className="text-brand-primary-light group-hover:text-brand-primary transition-colors" />
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-xl font-black text-black group-hover:text-brand-primary-light transition-colors duration-300 tracking-tight">
                    {title}
                </h3>
                <p className="text-text-on-brand/60 mt-2 leading-relaxed text-sm lg:text-base max-w-md font-medium">
                    {description}
                </p>
            </div>
        </div>
    );
};
