import {
    MOCK_SCHEMES,
    MOCK_NEWS,
    MOCK_WEATHER,
    MOCK_VIDEOS,
    MARKET_RATES_TICKER
} from '../constants';

import { youtubeAPI, newsAPI, schemesAPI } from './api';

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
        try {
            const cities = [
                { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, bg: "from-blue-400 to-indigo-500" },
                { name: "Rajkot", lat: 22.3039, lon: 70.8022, bg: "from-orange-400 to-yellow-500" },
                { name: "Surat", lat: 21.1702, lon: 72.8311, bg: "from-emerald-400 to-teal-500" },
                { name: "Amreli", lat: 21.6030, lon: 71.2150, bg: "from-rose-400 to-pink-500" }
            ];

            const weatherPromises = cities.map(async (city) => {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,rain,weather_code`
                );
                const data = await response.json();

                const code = data.current.weather_code;
                let conditionKey = "weather.conditions.sunny";
                let icon = "Sun";

                if (code >= 1 && code <= 3) {
                    conditionKey = "weather.conditions.cloudy";
                    icon = "Cloud";
                } else if (code >= 51 || data.current.rain > 0) {
                    conditionKey = "weather.conditions.rainy";
                    icon = "CloudRain";
                }

                return {
                    city: city.name,
                    temp: `${Math.round(data.current.temperature_2m)}°C`,
                    conditionKey: conditionKey,
                    icon: icon,
                    bg: city.bg
                };
            });

            return await Promise.all(weatherPromises);
        } catch (error) {
            console.error("Failed to fetch live weather, falling back to mock:", error);
            return MOCK_WEATHER;
        }
    },

    getSchemes: async () => {
        try {
            const response = await schemesAPI.getLatestAgricultureSchemes();
            if (response.success && Array.isArray(response.data)) {
                return response.data;
            }
            return MOCK_SCHEMES;
        } catch (error) {
            console.error('Failed to fetch Agriculture schemes:', error);
            return MOCK_SCHEMES;
        }
    },

    getNews: async () => {
        try {
            const response = await newsAPI.getLatestAgricultureNews();
            if (response.success && Array.isArray(response.data)) {
                return response.data;
            }
            return MOCK_NEWS;
        } catch (error) {
            console.error('Failed to fetch Agriculture news:', error);
            return MOCK_NEWS;
        }
    },

    getVideos: async () => {
        try {
            // Call backend RSS-based Agriculture Video API
            const response = await youtubeAPI.getAgricultureVideos();
            if (response.success && Array.isArray(response.data)) {
                return response.data;
            }

            // Fallback to mock data if API fails
            return MOCK_VIDEOS;
        } catch (error) {
            console.error('Failed to fetch Agriculture videos:', error);
            // Fallback to mock data
            return MOCK_VIDEOS;
        }
    },

    getMarketRates: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MARKET_RATES_TICKER.slice(0, 4);
    },
};
