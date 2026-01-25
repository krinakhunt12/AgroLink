import React from 'react';

// Main Components
import { HeroSection } from '../components/home/HeroSection';
import { WeatherWidget } from '../components/home/WeatherWidget';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { VideoGallery } from '../components/home/VideoGallery';
import { SchemesNewsSection } from '../components/home/SchemesNewsSection';
import { LiveFeaturesSection } from '../components/home/live-features/LiveFeaturesSection';
import { DownloadBanner } from '../components/home/DownloadBanner';
import { Testimonials } from '../components/home/Testimonials';
import { FinalCTA } from '../components/home/FinalCTA';
import { PopularSearches } from '../components/home/PopularSearches';

// Hooks
import { useHome } from '../hooks/useHome';

/**
 * Home Page
 * Refactored into a modular structure with presentational components 
 * and a custom hook for business logic.
 */
const Home: React.FC = () => {
  const {
    t,
    categories,
    liveFeatures,
    weatherData,
    schemes,
    news,
    videos,
    videoCategory,
    setVideoCategory,
    marketRates,
    seoKeywords,
    testimonials,
    isLoading,
    isVideosLoading
  } = useHome();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-bg-base z-[100] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-muted font-semibold">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-bg-base">

      {/* 1. Hero Section - Direct & Professional */}
      <HeroSection />

      {/* 2. Weather Widget - Live updates */}
      <WeatherWidget
        weatherData={weatherData}
        title={t('weather.title')}
        subtitle={t('weather.subtitle')}
        liveUpdatesLabel={t('weather.liveUpdates')}
        liveNowLabel={t('weather.liveNow')}
      />

      {/* 4. Categories - Browse products */}
      <CategoryGrid
        categories={categories}
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        viewAllText={t('categories.viewAll')}
      />

      {/* 5. Video Gallery - Educational content */}
      <VideoGallery
        title={t('videos.title')}
        subtitle={t('videos.subtitle')}
        videos={videos}
        currentCategory={videoCategory}
        onCategoryChange={setVideoCategory}
        isLoading={isVideosLoading}
      />

      {/* 6. Schemes & News - Updates for farmers */}
      <SchemesNewsSection
        schemesTitle={t('schemes.title')}
        schemesViewDetailsText={t('schemes.viewDetails')}
        schemes={schemes}
        newsTitle={t('news.title')}
        newsViewAllText={t('news.viewAll')}
        news={news}
      />

      {/* 7. Live Features Section - Platform capabilities & Dynamic Market Rates */}
      <LiveFeaturesSection
        title={t('liveFeatures.title')}
        features={liveFeatures}
      />

      {/* 8. Download Banner - App promotion */}
      <DownloadBanner
        title={t('download.title')}
        subtitle={t('download.subtitle')}
        buttonText={t('download.btn')}
      />

      {/* 9. Testimonials - Social proof */}
      <Testimonials
        title={t('testimonials.title')}
        subtitle={t('testimonials.subtitle')}
        testimonials={testimonials}
      />

      {/* 10. Final CTA - Engagement driver */}
      <FinalCTA
        title={t('ctaFinal.title')}
        subtitle={t('ctaFinal.subtitle')}
        buttonText={t('ctaFinal.startBtn')}
      />

      {/* SEO Section - Popular searches */}
      <PopularSearches
        title={t('footer.popularSearches')}
        keywords={seoKeywords}
      />
    </div>
  );
};

export default Home;
