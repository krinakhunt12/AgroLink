import rssService from '../services/rssService.js';
import { govtSchemeSources } from '../data/govtSchemeSources.js';
import { classifyScheme } from '../ml/schemeClassifier.js';

/**
 * Controller for Government Schemes related operations
 */
class SchemeController {
    /**
     * Get the latest useful government schemes from official RSS feeds
     */
    async getLatestSchemes(req, res) {
        try {
            console.log('📡 Fetching government updates from official RSS feeds...');

            // 1. Fetch all items from government sources
            const rawItems = await rssService.fetchAllNews(govtSchemeSources);
            console.log(`📥 Fetched ${rawItems.length} raw official updates total.`);

            // 2. Apply filtering and classification
            const processedSchemes = rawItems.map(item => {
                const classification = classifyScheme(item.title, item.description);
                return {
                    ...item,
                    isUseful: classification.isUseful,
                    relevanceCategory: classification.category,
                    relevanceScore: classification.score
                };
            });

            // 3. Filter only useful/relevant ones and limit results
            const usefulSchemes = processedSchemes
                .filter(s => s.isUseful)
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, 15);

            console.log(`✅ Identified ${usefulSchemes.length} useful government schemes/updates.`);

            // 4. Return the results
            res.status(200).json({
                success: true,
                count: usefulSchemes.length,
                sourcesSearched: govtSchemeSources.length,
                data: usefulSchemes
            });
        } catch (error) {
            console.error('❌ Error in getLatestSchemes:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch government agriculture schemes',
                error: error.message
            });
        }
    }
}

export default new SchemeController();
