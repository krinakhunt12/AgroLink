import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
    Wheat, Sprout, CheckCircle, TrendingUp, HeartHandshake
} from 'lucide-react';

interface Category {
    name: string;
    icon: string;
    color: string;
}

interface CategoryGridProps {
    categories: Category[];
    title: string;
    subtitle: string;
    viewAllText: string;
}

const iconMap = {
    Wheat,
    Sprout,
    CheckCircle,
    TrendingUp,
    HeartHandshake
};

import { Button } from '../ui/button';

import { Card, CardContent } from '../ui/card';

export const CategoryGrid: React.FC<CategoryGridProps> = React.memo(({
    categories,
    title,
    subtitle,
    viewAllText
}) => {
    return (
        <section className="py-24 bg-bg-surface">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-16 pb-8 border-b border-border-subtle/50">
                    <div className="text-center sm:text-left">
                        <h2 className="text-4xl font-black text-text-primary tracking-tight">{title}</h2>
                        <p className="text-text-secondary mt-3 font-medium text-lg">{subtitle}</p>
                    </div>
                    <Button asChild variant="ghost" className="hidden sm:flex bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary font-black px-8 py-3 rounded-full transition-all hover:-translate-y-1">
                        <Link to="/market" className="flex items-center gap-2">
                            {viewAllText} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {categories.map((cat, idx) => {
                        const Icon = iconMap[cat.icon as keyof typeof iconMap];
                        return (
                            <Link to="/market" key={idx} className="block group">
                                <Card className="h-full border-none shadow-theme-sm transition-all duration-500 group-hover:shadow-theme-lg group-hover:-translate-y-2 bg-bg-base/50 group-hover:bg-bg-base overflow-hidden relative">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${cat.color} opacity-80`} />
                                    <CardContent className="flex flex-col items-center justify-center p-10">
                                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-white shadow-theme-sm group-hover:shadow-theme`}>
                                            {Icon && <Icon size={36} className={`${cat.color.replace('bg-', 'text-').replace('/20', '')}`} />}
                                        </div>
                                        <h3 className="font-black text-text-primary text-center text-lg tracking-tight group-hover:text-brand-primary transition-colors">{cat.name}</h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

CategoryGrid.displayName = 'CategoryGrid';
