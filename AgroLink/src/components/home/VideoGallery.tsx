import React from 'react';
import { Play } from 'lucide-react';

interface Video {
    title: string;
    thumbnail: string;
    videoUrl: string;
    views: string;
}

interface VideoGalleryProps {
    title: string;
    subtitle: string;
    viewAllText: string;
    videos: Video[];
}

import { Button } from '../ui/button';
import { Card } from '../ui/card';

export const VideoGallery: React.FC<VideoGalleryProps> = React.memo(({
    title,
    subtitle,
    viewAllText,
    videos
}) => {
    return (
        <section className="py-28 bg-[#0a0a0a] text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-status-error/10 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl font-black flex items-center justify-center md:justify-start gap-4 tracking-tighter">
                            <div className="p-3 bg-status-error/10 rounded-2xl border border-status-error/20">
                                <Play className="fill-status-error text-status-error w-8 h-8" />
                            </div>
                            {title}
                        </h2>
                        <p className="text-stone-400 mt-4 font-medium text-xl max-w-xl">{subtitle}</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex bg-white/5 border-white/10 hover:bg-white/10 text-stone-300 hover:text-white px-10 py-4 rounded-2xl transition-all font-black uppercase tracking-[0.15em] text-xs">
                        {viewAllText}
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {videos.map((video, idx) => (
                        <Card
                            key={idx}
                            className="bg-stone-900/40 border-white/5 rounded-[32px] overflow-hidden group transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] hover:border-white/10"
                        >
                            <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-all duration-500">
                                        <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-115 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/30 transition-all duration-500">
                                            <Play className="w-10 h-10 fill-white text-white opacity-80 group-hover:opacity-100 transition-opacity translate-x-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-5 left-5">
                                        <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-white shadow-lg">
                                            {video.views} Views
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-black text-white text-xl mb-3 line-clamp-2 leading-[1.3] group-hover:text-brand-primary transition-colors tracking-tight">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                        <p className="text-[10px] text-stone-500 font-black uppercase tracking-[0.2em]">Agrolink Tutorial</p>
                                    </div>
                                </div>
                            </a>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
});

VideoGallery.displayName = 'VideoGallery';
