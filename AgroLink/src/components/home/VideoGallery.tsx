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

export const VideoGallery: React.FC<VideoGalleryProps> = React.memo(({
    title,
    subtitle,
    viewAllText,
    videos
}) => {
    return (
        <section className="py-20 bg-stone-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            <Play className="fill-red-500 text-red-500" /> {title}
                        </h2>
                        <p className="text-gray-400 mt-2">{subtitle}</p>
                    </div>
                    <button className="hidden md:block text-sm border border-gray-600 px-4 py-2 rounded-full hover:bg-gray-800 transition">
                        {viewAllText}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video, idx) => (
                        <a
                            href={video.videoUrl}
                            key={idx}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-stone-800 rounded-xl overflow-hidden group transition-transform hover:-translate-y-1"
                        >
                            <div className="relative h-40">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="w-10 h-10 fill-white text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-xs text-stone-500 font-medium">{video.views} views</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
});

VideoGallery.displayName = 'VideoGallery';
