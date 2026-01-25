import axios from "axios";
import { fetchAgricultureVideos } from "../services/youtube.service.js";
import { classifyVideo } from "../ml/videoClassifier.js";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const getAgricultureVideos = async (req, res) => {
    try {
        const query = req.query.q || "agriculture farming india";

        // 1. Fetch fresh videos from YouTube
        const videos = await fetchAgricultureVideos(query);

        let processedVideos = [];

        try {
            // 2. Call Python ML Service for intelligent filtering
            const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
                videos: videos.map(v => ({
                    videoId: v.videoId,
                    title: v.title,
                    description: v.description
                }))
            });

            const predictions = mlResponse.data.results;

            // 3. Merge predictions and filter only useful ones
            processedVideos = videos
                .map(v => {
                    const pred = predictions.find(p => p.videoId === v.videoId);
                    return {
                        ...v,
                        is_useful: pred ? pred.is_useful : false, // STRICTOR: Only if ML says so
                        usefulness_score: pred ? pred.confidence : 0,
                        category: classifyVideo(v.title + " " + v.description)
                    };
                })
                .filter(v => v.is_useful) // intelligent filtering
                .sort((a, b) => b.usefulness_score - a.usefulness_score); // Ranking by score

        } catch (mlError) {
            console.warn("ML Service unavailable, falling back to basic keyword classification:", mlError.message);
            // Fallback: If ML is down, use a simple heuristic to show something relevant
            processedVideos = videos
                .map(v => ({
                    ...v,
                    is_useful: true,
                    usefulness_score: 0.5,
                    category: classifyVideo(v.title + " " + v.description)
                }))
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); // Fallback ranking by recency
        }

        res.json({
            success: true,
            count: processedVideos.length,
            data: processedVideos
        });

    } catch (error) {
        console.error("Video API Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
