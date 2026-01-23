import {
    MOCK_SCHEMES,
    MOCK_NEWS,
    MOCK_WEATHER,
    MOCK_VIDEOS,
    MARKET_RATES_TICKER
} from '../constants';

/**
 * Home Service
 * Handles data fetching related to the home page.
 * In a real app, these would be fetch/axios calls to a backend.
 */
export const homeService = {
    getStats: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { value: '50k+', labelKey: 'stats.farmers', icon: 'Users' },
            { value: '10k+', labelKey: 'stats.products', icon: 'ShoppingBag' },
            { value: '1.2k+', labelKey: 'stats.villages', icon: 'MapPin' },
            { value: '₹5 Cr+', labelKey: 'stats.revenue', icon: 'IndianRupee' },
        ];
    },

    getCategories: async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return [
            { nameKey: 'categories.items.grains', icon: 'Wheat', color: 'bg-amber-100 text-amber-700' },
            { nameKey: 'categories.items.vegetables', icon: 'Sprout', color: 'bg-green-100 text-green-700' },
            { nameKey: 'categories.items.pulses', icon: 'CheckCircle', color: 'bg-orange-100 text-orange-700' },
            { nameKey: 'categories.items.spices', icon: 'TrendingUp', color: 'bg-red-100 text-red-700' },
            { nameKey: 'categories.items.fruits', icon: 'Sprout', color: 'bg-pink-100 text-pink-700' },
            { nameKey: 'categories.items.organic', icon: 'HeartHandshake', color: 'bg-emerald-100 text-emerald-700' },
        ];
    },

    getWeather: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_WEATHER;
    },

    getSchemes: async () => {
        await new Promise(resolve => setTimeout(resolve, 700));
        return MOCK_SCHEMES;
    },

    getNews: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_NEWS;
    },

    getVideos: async () => {
        await new Promise(resolve => setTimeout(resolve, 900));
        return MOCK_VIDEOS;
    },

    getMarketRates: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MARKET_RATES_TICKER.slice(0, 4);
    },
};
