import rssService from '../services/rssService.js';
import { trustedChannels } from '../data/agricultureChannels.js';
import { classifyVideo } from '../ml/videoClassifier.js';

/**
 * Controller for Video related operations
 */
class VideoController {
    /**
     * Get the latest useful agriculture videos from RSS feeds
     * Uses YouTube RSS feeds (no API key required)
     */
    async getLatestVideos(req, res) {
        try {
            console.log('📡 Fetching videos from YouTube RSS feeds...');

            // 1. Fetch all videos from trusted channels
            const rawVideos = await rssService.fetchAllChannels(trustedChannels);
            console.log(`📥 Fetched ${rawVideos.length} raw videos total.`);

            // 2. Apply filtering and classification using the ML-inspired logic
            const processedVideos = rawVideos.map(video => {
                const classification = classifyVideo(video.title, video.description);
                return {
                    ...video,
                    isUseful: classification.isUseful,
                    category: classification.category,
                    relevanceScore: classification.score
                };
            });

            // 3. Filter only useful ones and limit results
            const usefulVideos = processedVideos
                .filter(v => v.isUseful)
                .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance then date
                .slice(0, 20);

            console.log(`✅ Identified ${usefulVideos.length} useful agriculture videos.`);

            // 4. Return the results
            res.status(200).json({
                success: true,
                count: usefulVideos.length,
                channelsSearched: trustedChannels.length,
                data: usefulVideos
            });
        } catch (error) {
            console.error('❌ Error in getLatestVideos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch usefulness-filtered agriculture videos',
                error: error.message
            });
        }
    }
}

export default new VideoController();
