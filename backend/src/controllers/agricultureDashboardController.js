import rssService from '../services/rssService.js';
import { agricultureChannels } from '../data/agricultureChannels.js';
import { newsSources } from '../data/agricultureNewsSources.js';
import { govtSchemeSources } from '../data/govtSchemeSources.js';
import {
    calculateUsefulnessScore,
    detectSchemes,
    filterByDate,
    smartSearch
} from '../utils/agricultureContentEnhancer.js';

/**
 * Controller for the Comprehensive Agriculture Information Dashboard
 */
class AgricultureDashboardController {
    /**
     * Get filtered, ranked, and categorized agriculture content
     */
    async getDashboardData(req, res) {
        try {
            // 1. Get query params with fallbacks from cookie-based userPreferences
            const language = req.query.language || req.userPreferences.language;
            const search = req.query.search || '';
            const dateFilter = req.query.dateFilter || '';

            // 2. Update preferences in cookies if provided in query
            if (req.query.language) res.setPreference('language', req.query.language);
            if (req.query.search) res.setPreference('section', 'search_active');

            console.log(`📡 Fetching data (Lang: ${language}, Pref: ${req.userPreferences.category})`);

            // 3. Concurrent Fetching (Using cached RSS Service)
            const [rawVideos, rawNews, rawSchemes] = await Promise.all([
                rssService.fetchAllChannels(agricultureChannels),
                rssService.fetchAllNews(newsSources, 'NEWS'),
                rssService.fetchAllNews(govtSchemeSources, 'SCHEMES')
            ]);

            // 4. Processing Helper
            const processItems = (items, type) => {
                return items.map(item => {
                    const score = calculateUsefulnessScore(item);
                    const schemes = detectSchemes(`${item.title} ${item.description}`);

                    return {
                        ...item,
                        contentType: type,
                        usefulnessScore: score,
                        detectedSchemes: schemes,
                        isTrusted: score > 60,
                        translatedTitle: language === 'gu' ? `(GU) ${item.title}` : item.title
                    };
                });
            };

            let processedVideos = processItems(rawVideos, 'video');
            let processedNews = processItems(rawNews, 'news');
            let processedSchemes = processItems(rawSchemes, 'scheme');

            // 5. Apply Filters
            let allContent = [...processedVideos, ...processedNews, ...processedSchemes];

            if (search) {
                allContent = smartSearch(allContent, search);
            }

            if (dateFilter) {
                allContent = filterByDate(allContent, dateFilter);
            }

            // 6. Rank content
            allContent.sort((a, b) => b.usefulnessScore - a.usefulnessScore);

            const dashboard = {
                videos: allContent.filter(i => i.contentType === 'video').slice(0, 15),
                news: allContent.filter(i => i.contentType === 'news').slice(0, 15),
                schemes: allContent.filter(i => i.contentType === 'scheme').slice(0, 15),
                topFeatured: allContent.slice(0, 5)
            };

            // 7. Add HTTP Cache-Control header for client-side caching (5 mins)
            res.set('Cache-Control', 'public, max-age=300');

            res.status(200).json({
                success: true,
                userPreferences: req.userPreferences,
                filtersApplied: { search, dateFilter, language },
                count: allContent.length,
                lastUpdated: new Date().toISOString(),
                data: dashboard
            });

        } catch (error) {
            console.error('❌ Error in Agriculture Dashboard:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to aggregate agriculture information',
                error: error.message
            });
        }
    }
}

export default new AgricultureDashboardController();
