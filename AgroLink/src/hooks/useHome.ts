import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home-service';
import { SEO_KEYWORDS } from '../constants';

/**
 * Custom hook for Home page business logic
 */
export const useHome = () => {
    const { t } = useTranslation();
    const [videoCategory, setVideoCategory] = useState('all');

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

    // Dynamic Video Query - No API Key required (RSS based)
    const videosQuery = useQuery({
        queryKey: ['home', 'videos'],
        queryFn: () => homeService.getVideos(),
        staleTime: 10 * 60 * 1000 // 10 minutes
    });

    /* Commented out for now as requested
    const marketRatesQuery = useQuery({
        queryKey: ['home', 'marketRates'],
        queryFn: () => homeService.getMarketRates()
    });
    */

    // 2. Data Transformations
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

    const weatherData = useMemo(() => {
        const data = weatherQuery.data;
        if (!Array.isArray(data)) return [];
        return data.map((w: any) => ({
            ...w,
            condition: t(w.conditionKey || 'weather.conditions.sunny')
        }));
    }, [weatherQuery.data, t]);

    const schemes = useMemo(() => {
        const data = schemesQuery.data;
        if (!Array.isArray(data)) return [];
        return data.map((s: any) => ({
            ...s,
            tag: t(s.tag),
            title: t(s.title),
            desc: t(s.desc)
        }));
    }, [schemesQuery.data, t]);

    const news = useMemo(() => {
        const data = newsQuery.data;
        if (!Array.isArray(data)) return [];
        return data.map((n: any) => ({
            ...n,
            title: t(n.title)
        }));
    }, [newsQuery.data, t]);

    const videos = useMemo(() => {
        const data = videosQuery.data;
        if (!Array.isArray(data)) return [];
        // Important: Don't translate the actual YouTube title using t(), 
        // as YouTube titles are strings, not keys. 
        // We just return them as is or with language-specific fallbacks.
        return data;
    }, [videosQuery.data]);

    const marketRates = useMemo(() => {
        // const data = marketRatesQuery?.data;
        // if (!Array.isArray(data)) return [];
        // return data;
        return []; // Return empty for now
    }, []);

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
            color: 'green' as const
        },
        {
            quote: t('testimonials.buyerQuote'),
            name: t('testimonials.buyerName'),
            role: t('testimonials.buyerRole'),
            color: 'yellow' as const
        }
    ]), [t]);

    return {
        t,
        stats,
        categories,
        liveFeatures,
        weatherData,
        schemes,
        news,
        videos,
        videoCategory,
        setVideoCategory,
        marketRates,
        seoKeywords: SEO_KEYWORDS,
        testimonials,
        isLoading: statsQuery.isLoading || categoriesQuery.isLoading || weatherQuery.isLoading,
        isError: statsQuery.isError || categoriesQuery.isError,
        isVideosLoading: videosQuery.isLoading
    };
};
