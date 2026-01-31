import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
    Search, Calendar, Award, Filter,
    ExternalLink, Play, Newspaper, ShieldCheck,
    BrainCircuit
} from 'lucide-react';
import { agricultureService } from '../services/agricultureService';
import type { AgricultureContent } from '../services/agricultureService';

const AgricultureDashboard: React.FC = () => {
    const { t } = useTranslation(['news', 'common']);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'news' | 'schemes'>('all');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['agriculture-dashboard', search, dateFilter],
        queryFn: () => agricultureService.getDashboard({ search, dateFilter }),
        staleTime: 5 * 60 * 1000
    });

    const dashboardData = data?.data;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const DateFilterBadge = ({ label, value }: { label: string, value: string }) => (
        <button
            onClick={() => setDateFilter(value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${dateFilter === value
                ? 'bg-brand-primary text-white'
                : 'bg-bg-muted text-text-muted hover:bg-bg-surface border border-border-base'
                }`}
        >
            {label}
        </button>
    );

    const ContentCard = ({ item }: { item: AgricultureContent }) => (
        <div className="bg-bg-surface border border-border-base rounded-xl overflow-hidden hover:border-brand-primary/50 transition-all flex flex-col group">
            {item.contentType === 'video' && item.thumbnail ? (
                <div className="relative aspect-video">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white">
                            <Play className="w-5 h-5 fill-current" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-bg-muted/30 border-b border-border-base flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${item.contentType === 'news' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                        {item.contentType === 'news' ? <Newspaper className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    {item.isTrusted && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[10px] font-bold uppercase tracking-wider">
                            <Award className="w-3 h-3" /> {t('news:hub.verified')}
                        </div>
                    )}
                </div>
            )}

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                    {item.detectedSchemes.map(scheme => (
                        <span key={scheme} className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded uppercase">
                            {scheme}
                        </span>
                    ))}
                    {!item.detectedSchemes.length && item.relevanceCategory && (
                        <span className="px-2 py-0.5 bg-bg-muted text-text-muted text-[10px] font-bold rounded uppercase">
                            {item.relevanceCategory}
                        </span>
                    )}
                </div>

                <h3 className="font-bold text-text-primary text-sm line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">
                    {item.title}
                </h3>
                <p className="text-xs text-text-muted line-clamp-3 mb-4 flex-1">
                    {item.description.replace(/<[^>]*>/g, '')}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-base">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{item.source}</span>
                        <span className="text-[10px] text-text-muted">
                            {new Date(item.pubDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-bg-muted rounded-full hover:bg-brand-primary hover:text-white transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-base py-8 px-4 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                                <BrainCircuit className="w-5 h-5" />
                            </div>
                            <span className="text-brand-primary font-bold text-sm tracking-widest uppercase">{t('news:hub.smartIntelligence')}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">{t('news:hub.title')}</h1>
                        <p className="text-text-muted mt-2 max-w-xl">{t('news:hub.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('news:hub.searchPlaceholder')}
                                className="w-full bg-bg-surface border border-border-base rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white py-1.5 px-4 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                            >
                                {t('news:hub.searchBtn')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-wider mr-2">
                        <Calendar className="w-4 h-4" /> {t('news:hub.timeframe')}:
                    </div>
                    <DateFilterBadge label={t('news:hub.allTime')} value="" />
                    <DateFilterBadge label={t('news:hub.today')} value="Today" />
                    <DateFilterBadge label={t('news:hub.last7Days')} value="Last 7 Days" />
                    <DateFilterBadge label={t('news:hub.last30Days')} value="Last 30 Days" />
                </div>

                {/* Featured Section */}
                {dashboardData?.topFeatured.length && !search && !dateFilter && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                <Award className="w-6 h-6 text-amber-500" /> {t('news:hub.featuredTitle')}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardData.topFeatured.slice(0, 3).map(item => (
                                <ContentCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Tabs Dashboard */}
                <div className="bg-bg-surface border border-border-base rounded-2xl p-6 lg:p-8">
                    <div className="flex border-b border-border-base mb-8 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'all' ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            {t('news:hub.unifiedFeed')}
                            {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('schemes')}
                            className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'schemes' ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            {t('news:hub.govtSchemes')}
                            {activeTab === 'schemes' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('news')}
                            className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'news' ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            {t('news:hub.agriNews')}
                            {activeTab === 'news' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'videos' ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            {t('news:hub.videoGuides')}
                            {activeTab === 'videos' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />}
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-text-muted font-bold">{t('news:hub.scanning')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activeTab === 'all' && [...(dashboardData?.schemes || []), ...(dashboardData?.news || []), ...(dashboardData?.videos || [])].slice(0, 16).map(item => (
                                <ContentCard key={item.id} item={item} />
                            ))}
                            {activeTab === 'schemes' && (dashboardData?.schemes || []).map(item => (
                                <ContentCard key={item.id} item={item} />
                            ))}
                            {activeTab === 'news' && (dashboardData?.news || []).map(item => (
                                <ContentCard key={item.id} item={item} />
                            ))}
                            {activeTab === 'videos' && (dashboardData?.videos || []).map(item => (
                                <ContentCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}

                    {!isLoading && (!dashboardData || Object.values(dashboardData).every(arr => arr.length === 0)) && (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                                <Filter className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-text-primary">{t('news:hub.noResults')}</h3>
                            <p className="text-text-muted text-sm mt-1">{t('news:hub.noResultsDesc')}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AgricultureDashboard;
