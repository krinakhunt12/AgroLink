import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const CONFIDENCE_THRESHOLD = parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.7');

/**
 * ML Service Client
 * Communicates with Python ML service for video classification
 */
class MLService {
    /**
     * Predict if a video is useful for farmers
     * @param {Object} video - Video metadata
     * @returns {Promise<Object>} Prediction result with confidence score
     */
    async predictVideoUsefulness(video) {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
                title: video.title,
                description: video.description,
                channel: video.channel,
                duration: video.durationMinutes,
                views: video.views,
                engagement_rate: video.engagementRate
            }, {
                timeout: 5000, // 5 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                isUseful: response.data.is_useful,
                confidence: response.data.confidence,
                category: response.data.category || 'unknown',
                features: response.data.features || {}
            };
        } catch (error) {
            console.error('ML Service Error:', error.message);

            // Fallback to rule-based classification if ML service is down
            return this.fallbackClassification(video);
        }
    }

    /**
     * Batch predict multiple videos
     * More efficient than individual predictions
     * @param {Array} videos - Array of video metadata
     * @returns {Promise<Array>} Array of prediction results
     */
    async batchPredict(videos) {
        try {
            const payload = videos.map(video => ({
                title: video.title,
                description: video.description,
                channel: video.channel,
                duration: video.durationMinutes,
                views: video.views,
                engagement_rate: video.engagementRate
            }));

            const response = await axios.post(`${ML_SERVICE_URL}/batch-predict`, {
                videos: payload
            }, {
                timeout: 15000, // 15 second timeout for batch
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data.predictions;
        } catch (error) {
            console.error('ML Batch Prediction Error:', error.message);

            // Fallback to individual predictions
            return Promise.all(videos.map(video => this.predictVideoUsefulness(video)));
        }
    }

    /**
     * Fallback rule-based classification
     * Used when ML service is unavailable
     */
    fallbackClassification(video) {
        const title = video.title.toLowerCase();
        const description = video.description.toLowerCase();

        // Useful keywords for agriculture
        const usefulKeywords = [
            'farming', 'cultivation', 'crop', 'harvest', 'irrigation',
            'fertilizer', 'pesticide', 'organic', 'soil', 'seed',
            'tractor', 'equipment', 'technique', 'method', 'guide',
            'tutorial', 'training', 'demonstration', 'kheti', 'krishi'
        ];

        // Non-useful keywords
        const nonUsefulKeywords = [
            'song', 'music', 'movie', 'trailer', 'comedy',
            'prank', 'vlog', 'gaming', 'reaction', 'unboxing'
        ];

        let usefulScore = 0;
        let nonUsefulScore = 0;

        // Count keyword matches
        for (const keyword of usefulKeywords) {
            if (title.includes(keyword)) usefulScore += 2;
            if (description.includes(keyword)) usefulScore += 1;
        }

        for (const keyword of nonUsefulKeywords) {
            if (title.includes(keyword)) nonUsefulScore += 3;
            if (description.includes(keyword)) nonUsefulScore += 1;
        }

        // Calculate confidence based on keyword density
        const totalWords = title.split(' ').length + description.split(' ').length;
        const keywordDensity = (usefulScore - nonUsefulScore) / totalWords;

        const isUseful = usefulScore > nonUsefulScore && usefulScore >= 3;
        const confidence = Math.min(Math.abs(keywordDensity) * 10, 0.85); // Max 0.85 for fallback

        return {
            isUseful,
            confidence: parseFloat(confidence.toFixed(2)),
            category: isUseful ? 'tutorial' : 'entertainment',
            features: {
                usefulScore,
                nonUsefulScore,
                fallback: true
            }
        };
    }

    /**
     * Check if ML service is healthy
     */
    async healthCheck() {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/health`, {
                timeout: 3000
            });
            return response.data.status === 'healthy';
        } catch (error) {
            return false;
        }
    }

    /**
     * Get ML model information
     */
    async getModelInfo() {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/model-info`, {
                timeout: 3000
            });
            return response.data;
        } catch (error) {
            return {
                model: 'fallback',
                version: '1.0.0',
                accuracy: 'N/A'
            };
        }
    }

    /**
     * Filter videos based on ML predictions
     * @param {Array} videos - Videos with predictions
     * @returns {Array} Filtered useful videos
     */
    filterUsefulVideos(videos) {
        return videos.filter(video => {
            // Must be predicted as useful
            if (!video.mlPrediction?.isUseful) return false;

            // Must meet confidence threshold
            if (video.mlPrediction.confidence < CONFIDENCE_THRESHOLD) return false;

            return true;
        });
    }

    /**
     * Rank videos by combined score
     * Factors: ML confidence, recency, engagement, views
     */
    rankVideos(videos) {
        return videos.map(video => {
            const mlScore = video.mlPrediction?.confidence || 0;
            const recencyScore = video.recencyScore || 0;
            const engagementScore = Math.min(video.engagementRate / 10, 1); // Normalize to 0-1
            const viewScore = Math.min(Math.log10(video.views + 1) / 6, 1); // Normalize to 0-1

            // Weighted combination
            const rankingScore = (
                mlScore * 0.5 +           // 50% ML confidence
                recencyScore * 0.25 +     // 25% recency
                engagementScore * 0.15 +  // 15% engagement
                viewScore * 0.10          // 10% popularity
            );

            return {
                ...video,
                rankingScore: parseFloat(rankingScore.toFixed(3))
            };
        }).sort((a, b) => b.rankingScore - a.rankingScore);
    }
}

export default new MLService();
