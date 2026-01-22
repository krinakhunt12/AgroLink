import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Scheme {
    tag: string;
    title: string;
    desc: string;
    link: string;
}

interface NewsItem {
    date: string;
    title: string;
    source: string;
}

interface SchemesNewsSectionProps {
    schemesTitle: string;
    schemesViewDetailsText: string;
    schemes: Scheme[];
    newsTitle: string;
    newsViewAllText: string;
    news: NewsItem[];
}

export const SchemesNewsSection: React.FC<SchemesNewsSectionProps> = React.memo(({
    schemesTitle,
    schemesViewDetailsText,
    schemes,
    newsTitle,
    newsViewAllText,
    news
}) => {
    return (
        <section className="py-20 bg-blue-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Schemes Section */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="p-2 bg-blue-100 rounded-lg">
                                <ArrowRight className="text-blue-600 w-5 h-5" />
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900">{schemesTitle}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {schemes.map((scheme, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-blue-100 hover:shadow-lg transition">
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">
                                        {scheme.tag}
                                    </span>
                                    <h3 className="font-bold text-gray-900 mt-3 text-lg leading-tight">{scheme.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">{scheme.desc}</p>
                                    <a href={scheme.link} className="text-blue-600 text-sm font-bold mt-4 flex items-center gap-1">
                                        {schemesViewDetailsText} <ArrowRight size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* News Section */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="p-2 bg-green-100 rounded-lg">
                                <ArrowRight className="text-green-600 w-5 h-5 rotate-45" />
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900">{newsTitle}</h2>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="space-y-6">
                                {news.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start group border-b border-gray-50 last:border-0 pb-4">
                                        <div className="bg-green-50 p-2 rounded-lg text-center min-w-[60px]">
                                            <span className="text-xl font-bold text-green-700 block">{item.date.split(' ')[0]}</span>
                                            <span className="text-[10px] text-green-600 uppercase font-bold">{item.date.split(' ')[1]}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors">
                                                {item.title}
                                            </h3>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">
                                                {item.source}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/news" className="block w-full mt-6 py-2 text-center text-sm font-bold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition">
                                {newsViewAllText}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

SchemesNewsSection.displayName = 'SchemesNewsSection';
