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

import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export const SchemesNewsSection: React.FC<SchemesNewsSectionProps> = React.memo(({
    schemesTitle,
    schemesViewDetailsText,
    schemes,
    newsTitle,
    newsViewAllText,
    news
}) => {
    return (
        <section className="py-28 bg-bg-base relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] -mr-40 -mt-20"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Schemes Section */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                                <ArrowRight className="text-brand-primary w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black text-text-primary tracking-tight">{schemesTitle}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {schemes.map((scheme, idx) => (
                                <Card key={idx} className="bg-bg-surface p-8 border border-border-subtle shadow-theme-sm hover:shadow-theme-lg transition-all duration-500 group relative overflow-hidden rounded-[32px]">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary/20 group-hover:bg-brand-primary transition-colors duration-500"></div>
                                    <Badge variant="info" className="text-[10px] font-black uppercase py-1 px-3 tracking-widest bg-status-info/10 text-status-info border-none">
                                        {scheme.tag}
                                    </Badge>
                                    <h3 className="font-black text-text-primary mt-6 text-xl leading-tight group-hover:text-brand-primary transition-colors tracking-tight">{scheme.title}</h3>
                                    <p className="text-base text-text-secondary mt-4 line-clamp-3 leading-relaxed font-medium">{scheme.desc}</p>
                                    <Button asChild variant="link" className="text-brand-primary p-0 h-auto font-black mt-8 flex items-center gap-2 group/btn uppercase text-xs tracking-widest">
                                        <a href={scheme.link} className="flex items-center gap-2">
                                            {schemesViewDetailsText} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* News Section */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-status-success/10 rounded-2xl border border-status-success/20">
                                <ArrowRight className="text-status-success w-6 h-6 rotate-45" />
                            </div>
                            <h2 className="text-4xl font-black text-text-primary tracking-tight">{newsTitle}</h2>
                        </div>
                        <Card className="bg-bg-surface p-10 border border-border-subtle shadow-theme-lg rounded-[40px] relative overflow-hidden">
                            <div className="space-y-10">
                                {news.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 items-start group border-b border-border-subtle last:border-0 pb-8 last:pb-0">
                                        <div className="bg-status-success/10 p-4 rounded-2xl text-center min-w-[70px] border border-status-success/10 shadow-inner group-hover:bg-status-success group-hover:text-white transition-all duration-500">
                                            <span className="text-2xl font-black block leading-none mb-1">{item.date.split(' ')[0]}</span>
                                            <span className="text-[10px] uppercase font-black tracking-tighter opacity-80">{item.date.split(' ')[1]}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-text-primary text-lg leading-snug group-hover:text-status-success transition-colors tracking-tight">
                                                {item.title}
                                            </h3>
                                            <Badge variant="outline" className="text-[10px] mt-4 bg-bg-muted/30 text-text-muted border-none p-1.5 px-3 font-black tracking-[0.1em] uppercase">
                                                {item.source}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button asChild variant="outline" className="w-full h-auto py-5 mt-10 rounded-2xl font-black border-2 border-status-success/20 text-status-success hover:bg-status-success hover:text-white transition-all uppercase tracking-widest text-xs">
                                <Link to="/news">
                                    {newsViewAllText}
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
});

SchemesNewsSection.displayName = 'SchemesNewsSection';
