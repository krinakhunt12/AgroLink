import React from 'react';
import { Play, ArrowRight, Sparkles, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';
import type { Video } from '../../types';

interface VideoGalleryProps {
    title: string;
    subtitle: string;
    videos: Video[];
    currentCategory: string;
    onCategoryChange: (category: string) => void;
    isLoading?: boolean;
}

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'wheat', label: 'Wheat' },
    { id: 'cotton', label: 'Cotton' },
    { id: 'organic', label: 'Organic' },
    { id: 'pesticide', label: 'Pesticide' }
];

export const VideoGallery: React.FC<VideoGalleryProps> = React.memo(({
    title,
    subtitle,
    videos,
    currentCategory,
    onCategoryChange,
    isLoading = false
}) => {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-bg-base relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-status-info/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                            <Youtube size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">{t('videos.expertTutorials')}</span>
                        </div>
                        <h2 className="text-5xl font-black text-text-primary tracking-tight leading-[1.1]">
                            {title}
                        </h2>
                        <p className="text-text-secondary text-lg font-medium max-w-xl leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* Premium Category Navigation */}
                    <div className="flex flex-wrap gap-3 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-border-base shadow-sm">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentCategory === cat.id
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                                    : 'text-text-muted hover:bg-white hover:text-brand-primary'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative min-h-[400px]">
                    {/* Professional Loading State */}
                    {isLoading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center transition-all">
                            <div className="absolute inset-0 bg-bg-base/40 backdrop-blur-[4px]" />
                            <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-border-base flex flex-col items-center gap-4 relative z-30 scale-110">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin" />
                                    <Sparkles className="absolute inset-0 m-auto text-brand-primary animate-pulse" size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-text-primary uppercase tracking-[0.2em] text-xs">{t('ai.analysis')}</p>
                                    <p className="text-[10px] text-text-muted font-bold uppercase mt-1">{t('ai.filtering')}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {videos.length > 0 ? (
                            videos.map((video, idx) => (
                                <Card
                                    key={video.videoId ? `${video.videoId}-${idx}` : `video-${idx}`}
                                    className="group bg-white rounded-[24px] overflow-hidden border border-border-base hover:border-brand-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                                >
                                    <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                                        {/* Image Container */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Hover Play Button */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-110 transition-all duration-500">
                                                    <Play size={20} className="text-brand-primary fill-brand-primary ml-1" />
                                                </div>
                                            </div>

                                            {/* AI Certification Badge */}
                                            <div className="absolute top-4 right-4">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-status-success text-white rounded-lg shadow-lg border border-white/20">
                                                    <Sparkles size={10} className="animate-pulse" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider">{t('ai.verified')}</span>
                                                </div>
                                            </div>

                                            {/* Channel Tag */}
                                            <div className="absolute bottom-4 left-4">
                                                <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                                                    <p className="text-[9px] font-bold text-white uppercase tracking-wider truncate max-w-[120px]">
                                                        {video.channel}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1 h-3 bg-brand-primary rounded-full" />
                                                    <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">
                                                        {video.category || 'Tutorial'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-text-primary text-base line-clamp-2 leading-[1.4] group-hover:text-brand-primary transition-colors">
                                                    {video.title}
                                                </h3>
                                            </div>

                                            <div className="pt-4 border-t border-border-subtle flex items-center justify-between group/btn">
                                                <span className="text-[11px] font-black text-text-secondary uppercase tracking-widest">
                                                    {t('videos.watch')}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white/50 rounded-[40px] border border-dashed border-border-base">
                                <div className="bg-white inline-flex p-10 rounded-[40px] shadow-sm mb-6 border border-border-base">
                                    <Youtube size={64} className="text-stone-200" />
                                </div>
                                <h3 className="text-2xl font-black text-text-primary mb-3 uppercase tracking-tight">{t('videos.noVideosTitle')}</h3>
                                <p className="text-text-muted font-bold max-w-md mx-auto">{t('videos.noVideosDesc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
});

VideoGallery.displayName = 'VideoGallery';

