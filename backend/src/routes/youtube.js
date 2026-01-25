import express from 'express';
import youtubeService from '../services/youtubeService.js';
import mlService from '../services/mlService.js';

const router = express.Router();

/**
 * GET /api/youtube/videos
 * Fetch and filter agriculture videos using ML
 * 
 * Query Parameters:
 * - q: Search query (default: 'agriculture farming')
 * - maxResults: Maximum results to return (default: 10)
 * - category: Filter by category (wheat, cotton, organic, etc.)
 */
router.get('/videos', async (req, res) => {
    try {
        const { q = 'agriculture farming', maxResults = 10, category } = req.query;

        // Build search query
        let searchQuery = q;
        if (category && category !== 'all') {
            searchQuery = `${category} ${q}`;
        }

        console.log(`🔍 Searching YouTube for: "${searchQuery}"`);

        // Step 1: Fetch videos from YouTube API
        const rawVideos = await youtubeService.searchVideos(searchQuery, 50);
        console.log(`📹 Found ${rawVideos.length} videos from YouTube`);

        // Step 2: Apply basic quality filters
        const qualityVideos = rawVideos.filter(video => {
            const isQuality = youtubeService.isQualityVideo(video);
            const isNotSpam = !youtubeService.isSpamOrClickbait(video);
            return isQuality && isNotSpam;
        });
        console.log(`✅ ${qualityVideos.length} videos passed quality filters`);

        // Step 3: Get ML predictions for filtered videos
        const predictions = await mlService.batchPredict(qualityVideos);

        // Attach predictions to videos
        const videosWithPredictions = qualityVideos.map((video, index) => ({
            ...video,
            mlPrediction: predictions[index]
        }));

        // Step 4: Filter by ML usefulness
        const usefulVideos = mlService.filterUsefulVideos(videosWithPredictions);
        console.log(`🤖 ${usefulVideos.length} videos predicted as useful by ML`);

        // Step 5: Rank videos by combined score
        const rankedVideos = mlService.rankVideos(usefulVideos);

        // Step 6: Return top results
        const topVideos = rankedVideos.slice(0, parseInt(maxResults));

        res.json({
            success: true,
            data: topVideos.map(video => ({
                videoId: video.videoId,
                title: video.title,
                description: video.description.substring(0, 200) + '...',
                thumbnail: video.thumbnail,
                channel: video.channel,
                publishedAt: video.publishedAt,
                duration: Math.round(video.durationMinutes),
                views: video.views,
                likes: video.likes,
                engagementRate: video.engagementRate,
                category: video.mlPrediction.category,
                usefulnessScore: video.mlPrediction.confidence,
                rankingScore: video.rankingScore,
                url: `https://www.youtube.com/watch?v=${video.videoId}`
            })),
            metadata: {
                query: searchQuery,
                totalFetched: rawVideos.length,
                qualityFiltered: qualityVideos.length,
                mlFiltered: usefulVideos.length,
                returned: topVideos.length,
                filteredOut: rawVideos.length - topVideos.length
            }
        });

    } catch (error) {
        console.error('❌ Error fetching videos:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to fetch and filter videos'
        });
    }
});

/**
 * GET /api/youtube/video/:videoId
 * Get detailed information about a specific video
 */
router.get('/video/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        // Fetch single video details
        const videos = await youtubeService.searchVideos('', 1);
        const video = videos.find(v => v.videoId === videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        // Get ML prediction
        const prediction = await mlService.predictVideoUsefulness(video);

        res.json({
            success: true,
            data: {
                ...video,
                mlPrediction: prediction
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/youtube/health
 * Check system health
 */
router.get('/health', async (req, res) => {
    try {
        const mlHealthy = await mlService.healthCheck();
        const modelInfo = await mlService.getModelInfo();

        res.json({
            success: true,
            services: {
                youtube: {
                    status: 'healthy',
                    apiKey: process.env.YOUTUBE_API_KEY ? 'configured' : 'missing'
                },
                ml: {
                    status: mlHealthy ? 'healthy' : 'unavailable',
                    fallback: !mlHealthy,
                    model: modelInfo
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/youtube/categories
 * Get available video categories
 */
router.get('/categories', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'all', label: 'All Videos', query: 'agriculture farming' },
            { id: 'wheat', label: 'Wheat Farming', query: 'wheat cultivation' },
            { id: 'cotton', label: 'Cotton Farming', query: 'cotton farming' },
            { id: 'organic', label: 'Organic Farming', query: 'organic farming' },
            { id: 'pesticide', label: 'Pest Control', query: 'pesticide agriculture' },
            { id: 'irrigation', label: 'Irrigation', query: 'irrigation techniques' },
            { id: 'equipment', label: 'Farm Equipment', query: 'farming equipment' }
        ]
    });
});

export default router;
