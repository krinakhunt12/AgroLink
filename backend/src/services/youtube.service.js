import axios from "axios";
import { YOUTUBE_CONFIG } from "../config/youtube.config.js";

export const fetchAgricultureVideos = async (query) => {
    if (!YOUTUBE_CONFIG.API_KEY) {
        throw new Error("YouTube API Key is missing. Please check your .env file.");
    }
    const response = await axios.get(
        `${YOUTUBE_CONFIG.BASE_URL}/search`,
        {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                maxResults: YOUTUBE_CONFIG.MAX_RESULTS,
                key: YOUTUBE_CONFIG.API_KEY
            }
        }
    );

    return response.data.items.map(video => ({
        videoId: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
        publishedAt: video.snippet.publishedAt,
        channel: video.snippet.channelTitle
    }));
};
