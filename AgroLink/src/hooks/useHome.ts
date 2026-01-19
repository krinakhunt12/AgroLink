import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MOCK_SCHEMES,
    MOCK_NEWS,
    MOCK_WEATHER,
    MOCK_VIDEOS,
    MARKET_RATES_TICKER,
    SEO_KEYWORDS
} from '../constants';

/**
 * Custom hook for Home page business logic
 * Separates data fetching and state management from UI
 */
export const useHome = () => {
    const { t } = useTranslation();

    // Memoize static data to prevent unnecessary re-renders
    const stats = useMemo(() => ([
        { value: '50k+', label: t('stats.farmers'), icon: 'Users' },
        { value: '10k+', label: t('stats.products'), icon: 'ShoppingBag' },
        { value: '1.2k+', label: t('stats.villages'), icon: 'MapPin' },
        { value: '₹5 Cr+', label: t('stats.revenue'), icon: 'IndianRupee' },
    ]), [t]);

    const categories = useMemo(() => ([
        { name: t('categories.items.grains'), icon: 'Wheat', color: 'bg-amber-100 text-amber-700' },
        { name: t('categories.items.vegetables'), icon: 'Sprout', color: 'bg-green-100 text-green-700' },
        { name: t('categories.items.pulses'), icon: 'CheckCircle', color: 'bg-orange-100 text-orange-700' },
        { name: t('categories.items.spices'), icon: 'TrendingUp', color: 'bg-red-100 text-red-700' },
        { name: t('categories.items.fruits'), icon: 'Sprout', color: 'bg-pink-100 text-pink-700' },
        { name: t('categories.items.organic'), icon: 'HeartHandshake', color: 'bg-emerald-100 text-emerald-700' },
    ]), [t]);

    const liveFeatures = useMemo(() => ([
        { title: t('liveFeatures.livePrice'), desc: t('liveFeatures.livePriceDesc') },
        { title: t('liveFeatures.gpsSearch'), desc: t('liveFeatures.gpsSearchDesc') },
        { title: t('liveFeatures.securePay'), desc: t('liveFeatures.securePayDesc') },
        { title: t('liveFeatures.auction'), desc: t('liveFeatures.auctionDesc') }
    ]), [t]);

    const weatherData = useMemo(() => MOCK_WEATHER, []);
    const schemes = useMemo(() => MOCK_SCHEMES, []);
    const news = useMemo(() => MOCK_NEWS, []);
    const videos = useMemo(() => MOCK_VIDEOS, []);
    const marketRates = useMemo(() => MARKET_RATES_TICKER.slice(0, 4), []);
    const seoKeywords = useMemo(() => SEO_KEYWORDS, []);

    const heroContent = useMemo(() => ({
        tagline: t('hero.tagline'),
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        ctaFarmer: t('hero.ctaFarmer'),
        ctaBuyer: t('hero.ctaBuyer'),
    }), [t]);

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

    return {
        // Translations
        t,

        // Data
        stats,
        categories,
        liveFeatures,
        weatherData,
        schemes,
        news,
        videos,
        marketRates,
        seoKeywords,
        heroContent,
        testimonials,
    };
};
