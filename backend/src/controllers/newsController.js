import rssService from '../services/rssService.js';
import { newsSources } from '../data/agricultureNewsSources.js';
import { classifyVideo } from '../ml/videoClassifier.js'; // Using the same classifier logic for news

/**
 * Controller for Agricultural News related operations
 */
class NewsController {
    /**
     * Get the latest useful agriculture news from RSS feeds
     */
    async getLatestNews(req, res) {
        try {
            console.log('📡 Fetching news from agricultural RSS feeds...');

            // 1. Fetch all news from trusted sources
            const rawNews = await rssService.fetchAllNews(newsSources);
            console.log(`📥 Fetched ${rawNews.length} raw news articles total.`);

            // 2. Apply filtering and classification
            const processedNews = rawNews.map(news => {
                const classification = classifyVideo(news.title, news.description);
                return {
                    ...news,
                    isUseful: classification.isUseful,
                    relevanceCategory: classification.category,
                    relevanceScore: classification.score
                };
            });

            // 3. Filter only useful ones and limit results
            const usefulNews = processedNews
                .filter(n => n.isUseful)
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, 30);

            console.log(`✅ Identified ${usefulNews.length} useful agriculture news articles.`);

            // 4. Return the results
            res.status(200).json({
                success: true,
                count: usefulNews.length,
                sourcesSearched: newsSources.length,
                data: usefulNews
            });
        } catch (error) {
            console.error('❌ Error in getLatestNews:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch usefulness-filtered agriculture news',
                error: error.message
            });
        }
    }
}

export default new NewsController();
