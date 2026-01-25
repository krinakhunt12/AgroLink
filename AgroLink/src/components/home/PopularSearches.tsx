import React from 'react';

interface PopularSearchesProps {
    title: string;
    keywords: string[];
}

import { Badge } from '../ui/badge';

export const PopularSearches: React.FC<PopularSearchesProps> = React.memo(({
    title,
    keywords
}) => {
    return (
        <section className="py-8 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-[10px] font-bold text-text-muted mb-4 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {keywords.map((keyword, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="bg-bg-surface border-border-base text-text-secondary hover:border-brand-primary-light hover:text-brand-primary transition-colors cursor-default py-1 px-3"
                        >
                            {keyword}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    );
});

PopularSearches.displayName = 'PopularSearches';
