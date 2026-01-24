import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wheat, Sprout, CheckCircle, TrendingUp, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

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

export const CategoryGrid: React.FC<CategoryGridProps> = React.memo(({
    categories,
    title,
    subtitle,
    viewAllText
}) => {
    return (
        <section className="py-20 bg-white border-y border-border-base">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h2>
                        <p className="text-text-muted text-lg max-w-xl">{subtitle}</p>
                    </div>
                    <Button asChild variant="ghost" className="text-brand-primary font-semibold p-0 h-auto hover:bg-transparent hover:underline">
                        <Link to="/market" className="flex items-center gap-2">
                            {viewAllText} <ArrowRight size={16} />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((cat, idx) => {
                        const Icon = iconMap[cat.icon as keyof typeof iconMap];
                        return (
                            <Link to="/market" key={idx} className="group">
                                <Card className="border border-border-base bg-bg-surface hover:border-brand-primary/50 transition-colors rounded-lg h-full shadow-sm overflow-hidden">
                                    <CardContent className="flex flex-col items-center justify-center p-8">
                                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                                            {Icon && <Icon size={24} />}
                                        </div>
                                        <h3 className="font-bold text-text-primary text-sm text-center tracking-tight group-hover:text-brand-primary transition-colors">
                                            {cat.name}
                                        </h3>
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

