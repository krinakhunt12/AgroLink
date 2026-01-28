import React from 'react';
import { VideoGallery } from '../components/home/VideoGallery';
import { useHome } from '../hooks/useHome';

const Videos: React.FC = () => {
    const {
        t,
        videos,
        videoCategory,
        setVideoCategory,
        isVideosLoading
    } = useHome();

    return (
        <div className="flex flex-col min-h-screen font-sans bg-bg-base">
            <VideoGallery
                title={t('videos.title')}
                subtitle={t('videos.subtitle')}
                videos={videos}
                currentCategory={videoCategory}
                onCategoryChange={setVideoCategory}
                isLoading={isVideosLoading}
            />
        </div>
    );
};

export default Videos;
