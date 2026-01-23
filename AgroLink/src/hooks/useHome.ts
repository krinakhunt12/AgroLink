import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home-service';
import { SEO_KEYWORDS } from '../constants';
import AppLogger, { Category } from '../utils/logger';

/**
 * Custom hook for Home page business logic
 * Follows hooks-driven design and thin UI principles.
 * Orchestrates data from multiple TanStack Query hooks.
 */
export const useHome = () => {
    const { t } = useTranslation();

    // 1. Fetching data using TanStack Query
    const statsQuery = useQuery({
        queryKey: ['home', 'stats'],
        queryFn: () => homeService.getStats()
    });

    const categoriesQuery = useQuery({
        queryKey: ['home', 'categories'],
        queryFn: () => homeService.getCategories()
    });

    const weatherQuery = useQuery({
        queryKey: ['home', 'weather'],
        queryFn: () => homeService.getWeather()
    });

    const schemesQuery = useQuery({
        queryKey: ['home', 'schemes'],
        queryFn: () => homeService.getSchemes()
    });

    const newsQuery = useQuery({
        queryKey: ['home', 'news'],
        queryFn: () => homeService.getNews()
    });

    const videosQuery = useQuery({
        queryKey: ['home', 'videos'],
        queryFn: () => homeService.getVideos()
    });

    const marketRatesQuery = useQuery({
        queryKey: ['home', 'marketRates'],
        queryFn: () => homeService.getMarketRates()
    });

    // 2. Data Transformations (Pure logic)
    const stats = useMemo(() => {
        const data = statsQuery.data;
        if (!Array.isArray(data)) return [];
        return data.map((s: any) => ({
            ...s,
            label: t(s.labelKey)
        }));
    }, [statsQuery.data, t]);

    const categories = useMemo(() => {
        const data = categoriesQuery.data;
        if (!Array.isArray(data)) return [];
        return data.map((c: any) => ({
            ...c,
            name: t(c.nameKey)
        }));
    }, [categoriesQuery.data, t]);

    const liveFeatures = useMemo(() => ([
        { title: t('liveFeatures.livePrice'), desc: t('liveFeatures.livePriceDesc') },
        { title: t('liveFeatures.gpsSearch'), desc: t('liveFeatures.gpsSearchDesc') },
        { title: t('liveFeatures.securePay'), desc: t('liveFeatures.securePayDesc') },
        { title: t('liveFeatures.auction'), desc: t('liveFeatures.auctionDesc') }
    ]), [t]);

    const testimonials = useMemo(() => ([
        {
            quote: t('testimonials.farmerQuote'),
            name: t('testimonials.farmerName'),
            role: t('testimonials.farmerRole'),
            color: 'green'
        },
        {
            quote: t('testimonials.buyerQuote'),
            name: t('testimonials.buyerName'),
            role: t('testimonials.buyerRole'),
            color: 'yellow'
        }
    ]), [t]);

    // Log important state transitions
    useMemo(() => {
        if (statsQuery.isSuccess) {
            AppLogger.info(Category.DATA, 'Home page data loaded successfully');
        }
    }, [statsQuery.isSuccess]);

    return {
        t,
        stats,
        categories,
        liveFeatures,
        weatherData: Array.isArray(weatherQuery.data) ? weatherQuery.data : [],
        schemes: Array.isArray(schemesQuery.data) ? schemesQuery.data : [],
        news: Array.isArray(newsQuery.data) ? newsQuery.data : [],
        videos: Array.isArray(videosQuery.data) ? videosQuery.data : [],
        marketRates: Array.isArray(marketRatesQuery.data) ? marketRatesQuery.data : [],
        seoKeywords: SEO_KEYWORDS,
        testimonials,
        // Combined loading/error states
        isLoading: statsQuery.isLoading || categoriesQuery.isLoading || weatherQuery.isLoading,
        isError: statsQuery.isError || categoriesQuery.isError
    };
};
