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

export const CategoryGrid: React.FC<CategoryGridProps> = React.memo(({
    categories,
    title,
    subtitle,
    viewAllText
}) => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                        <p className="text-gray-500 mt-2">{subtitle}</p>
                    </div>
                    <Link
                        to="/market"
                        className="hidden sm:flex items-center text-green-700 font-bold hover:text-green-800 transition bg-green-50 px-4 py-2 rounded-full"
                    >
                        {viewAllText} <ArrowRight className="ml-1 w-5 h-5" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => {
                        const Icon = iconMap[cat.icon as keyof typeof iconMap];
                        return (
                            <Link
                                to="/market"
                                key={idx}
                                className="group flex flex-col items-center bg-gray-50 p-6 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${cat.color}`}>
                                    {Icon && <Icon size={30} />}
                                </div>
                                <h3 className="font-bold text-gray-800 text-center">{cat.name}</h3>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

CategoryGrid.displayName = 'CategoryGrid';
