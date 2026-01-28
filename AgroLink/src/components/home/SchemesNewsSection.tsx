import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Newspaper } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

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
    link?: string;
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
        <section className="py-20 bg-white border-b border-border-base">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Schemes Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-brand-primary w-6 h-6" />
                            <h2 className="text-2xl font-bold text-text-primary tracking-tight">{schemesTitle}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {schemes.map((scheme, idx) => (
                                <Card key={idx} className="p-6 border border-border-base bg-bg-surface hover:border-brand-primary/50 transition-colors rounded-lg shadow-sm flex flex-col group/card">
                                    <div className="flex-1 space-y-3">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-status-info/5 text-status-info border-status-info/10">
                                            {scheme.tag}
                                        </Badge>
                                        <h3 className="font-bold text-text-primary text-lg leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                            {scheme.title}
                                        </h3>
                                        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed font-medium">
                                            {scheme.desc}
                                        </p>
                                    </div>
                                    <Button asChild variant="link" className="text-brand-primary p-0 h-auto font-bold mt-6 text-sm flex items-center gap-2 group hover:no-underline w-fit">
                                        <a
                                            href={scheme.link}
                                            target={scheme.link?.startsWith('http') ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                        >
                                            {schemesViewDetailsText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* News Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-3">
                            <Newspaper className="text-status-success w-6 h-6" />
                            <h2 className="text-2xl font-bold text-text-primary tracking-tight">{newsTitle}</h2>
                        </div>
                        <Card className="border border-border-base bg-bg-surface rounded-lg shadow-sm overflow-hidden divide-y divide-border-subtle">
                            {news.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.link || '#'}
                                    target={item.link ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="p-6 flex gap-4 hover:bg-bg-muted/30 transition-colors group cursor-pointer"
                                >
                                    <div className="bg-bg-muted p-2 rounded flex flex-col items-center justify-center min-w-[60px] h-fit border border-border-subtle group-hover:bg-status-success group-hover:border-status-success group-hover:text-white transition-colors">
                                        <span className="text-base font-bold leading-none">{item.date.split(' ')[0]}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{item.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-text-primary text-[15px] leading-tight group-hover:text-status-success transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-1 bg-status-success rounded-full" />
                                            {item.source}
                                        </p>
                                    </div>
                                </a>
                            ))}
                            <div className="p-4 bg-bg-muted/10">
                                <Button asChild variant="outline" className="w-full border-border-base font-semibold text-text-secondary hover:bg-bg-muted hover:text-text-primary">
                                    <Link to="/news">
                                        {newsViewAllText}
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
});

SchemesNewsSection.displayName = 'SchemesNewsSection';

