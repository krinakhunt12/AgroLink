import React from 'react';

interface PopularSearchesProps {
    title: string;
    keywords: string[];
}

export const PopularSearches: React.FC<PopularSearchesProps> = React.memo(({
    title,
    keywords
}) => {
    return (
        <section className="py-8 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">{title}</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="text-[10px] md:text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-default"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
});

PopularSearches.displayName = 'PopularSearches';
