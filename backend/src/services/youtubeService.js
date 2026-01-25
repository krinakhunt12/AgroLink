import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * YouTube Service
 * Handles all interactions with YouTube Data API v3
 */
class YouTubeService {
    /**
     * Search for agriculture-related videos
     * @param {string} query - Search query
     * @param {number} maxResults - Maximum number of results (default: 50)
     * @returns {Promise<Array>} Array of video metadata
     */
    async searchVideos(query, maxResults = 50) {
        try {
            // Step 1: Search for videos
            const searchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
                params: {
                    key: YOUTUBE_API_KEY,
                    q: `${query} agriculture farming india`,
                    part: 'snippet',
                    type: 'video',
                    maxResults: maxResults,
                    order: 'relevance',
                    regionCode: 'IN',
                    relevanceLanguage: 'en',
                    safeSearch: 'strict',
                    videoDefinition: 'any',
                    videoDuration: 'medium' // 4-20 minutes
                }
            });

            const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

            // Step 2: Get detailed statistics for videos
            const statsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
                params: {
                    key: YOUTUBE_API_KEY,
                    id: videoIds,
                    part: 'snippet,statistics,contentDetails'
                }
            });

            // Step 3: Transform data into structured format
            const videos = statsResponse.data.items.map(video => {
                const snippet = video.snippet;
                const statistics = video.statistics;
                const contentDetails = video.contentDetails;

                return {
                    videoId: video.id,
                    title: snippet.title,
                    description: snippet.description,
                    thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
                    channel: snippet.channelTitle,
                    channelId: snippet.channelId,
                    publishedAt: snippet.publishedAt,
                    duration: contentDetails.duration,
                    views: parseInt(statistics.viewCount || 0),
                    likes: parseInt(statistics.likeCount || 0),
                    comments: parseInt(statistics.commentCount || 0),
                    tags: snippet.tags || [],
                    categoryId: snippet.categoryId,
                    // Calculated metrics
                    engagementRate: this.calculateEngagementRate(statistics),
                    recencyScore: this.calculateRecencyScore(snippet.publishedAt),
                    durationMinutes: this.parseDuration(contentDetails.duration)
                };
            });

            return videos;
        } catch (error) {
            console.error('YouTube API Error:', error.response?.data || error.message);
            throw new Error(`Failed to fetch YouTube videos: ${error.message}`);
        }
    }

    /**
     * Get channel details
     * @param {string} channelId - YouTube channel ID
     * @returns {Promise<Object>} Channel information
     */
    async getChannelInfo(channelId) {
        try {
            const response = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
                params: {
                    key: YOUTUBE_API_KEY,
                    id: channelId,
                    part: 'snippet,statistics'
                }
            });

            const channel = response.data.items[0];
            return {
                channelId: channel.id,
                title: channel.snippet.title,
                description: channel.snippet.description,
                subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
                videoCount: parseInt(channel.statistics.videoCount || 0),
                viewCount: parseInt(channel.statistics.viewCount || 0),
                thumbnail: channel.snippet.thumbnails.default.url
            };
        } catch (error) {
            console.error('Channel Info Error:', error.message);
            return null;
        }
    }

    /**
     * Calculate engagement rate
     * Engagement = (likes + comments) / views
     */
    calculateEngagementRate(statistics) {
        const views = parseInt(statistics.viewCount || 0);
        const likes = parseInt(statistics.likeCount || 0);
        const comments = parseInt(statistics.commentCount || 0);

        if (views === 0) return 0;

        const engagement = ((likes + comments) / views) * 100;
        return parseFloat(engagement.toFixed(2));
    }

    /**
     * Calculate recency score (0-1)
     * More recent videos get higher scores
     */
    calculateRecencyScore(publishedAt) {
        const publishDate = new Date(publishedAt);
        const now = new Date();
        const daysSincePublished = (now - publishDate) / (1000 * 60 * 60 * 24);

        // Exponential decay: score = e^(-days/30)
        // Videos published today: ~1.0
        // Videos published 30 days ago: ~0.37
        // Videos published 90 days ago: ~0.05
        const score = Math.exp(-daysSincePublished / 30);
        return parseFloat(score.toFixed(3));
    }

    /**
     * Parse ISO 8601 duration to minutes
     * Example: PT15M33S -> 15.55 minutes
     */
    parseDuration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const seconds = parseInt(match[3] || 0);

        return hours * 60 + minutes + seconds / 60;
    }

    /**
     * Validate video quality
     * Filter out low-quality videos before ML processing
     */
    isQualityVideo(video) {
        // Minimum view count
        if (video.views < 100) return false;

        // Duration should be between 3 and 30 minutes
        if (video.durationMinutes < 3 || video.durationMinutes > 30) return false;

        // Should have some engagement
        if (video.engagementRate === 0 && video.views > 1000) return false;

        // Title should not be too short
        if (video.title.length < 10) return false;

        // Description should exist
        if (!video.description || video.description.length < 20) return false;

        return true;
    }

    /**
     * Detect spam/clickbait patterns
     */
    isSpamOrClickbait(video) {
        const title = video.title.toLowerCase();
        const description = video.description.toLowerCase();

        // Clickbait keywords
        const clickbaitPatterns = [
            'click here', 'shocking', 'you won\'t believe',
            'number will shock you', 'doctors hate',
            'one weird trick', 'secret revealed',
            'earn money fast', 'get rich quick'
        ];

        // Check for excessive caps
        const capsRatio = (video.title.match(/[A-Z]/g) || []).length / video.title.length;
        if (capsRatio > 0.5) return true;

        // Check for excessive exclamation marks
        const exclamationCount = (video.title.match(/!/g) || []).length;
        if (exclamationCount > 3) return true;

        // Check for clickbait patterns
        for (const pattern of clickbaitPatterns) {
            if (title.includes(pattern) || description.includes(pattern)) {
                return true;
            }
        }

        return false;
    }
}

export default new YouTubeService();
