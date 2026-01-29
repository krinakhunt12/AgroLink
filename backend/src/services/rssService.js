import Parser from 'rss-parser';
import cacheService from '../utils/cacheService.js';

const parser = new Parser({
    customFields: {
        item: [
            ['media:group', 'mediaGroup'],
            ['yt:videoId', 'videoId'],
            ['yt:channelId', 'channelId']
        ]
    }
});

const TTL = {
    VIDEOS: 60,      // 1 hour
    NEWS: 15,        // 15 mins
    SCHEMES: 360     // 6 hours
};

/**
 * Service to fetch YouTube videos and News via RSS
 * Now with Advanced Caching and Fallback logic.
 */
class RSSService {
    /**
     * Fetch videos from multiple channels with caching
     */
    async fetchAllChannels(channels) {
        const cacheKey = 'agro_videos_all';
        const cached = cacheService.get(cacheKey);

        // If cache exists and is fresh, return it
        if (cached && !cached.isExpired) {
            console.log('⚡ Serving VIDEOS from Fresh Cache');
            return cached.data;
        }

        try {
            console.log('🌐 Fetching fresh VIDEOS from YouTube RSS...');
            const fetchPromises = channels.map(channel =>
                this.fetchChannelVideos(channel.id)
            );
            const results = await Promise.all(fetchPromises);
            const flattened = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            // Save to cache
            cacheService.set(cacheKey, flattened, TTL.VIDEOS);
            return flattened;
        } catch (error) {
            // FALLBACK: If fetch fails but cache exists (even if expired), serve it
            if (cached) {
                console.warn('⚠️ VIDEO fetch failed. Serving STALE Cache as fallback.');
                return cached.data;
            }
            throw error;
        }
    }

    /**
     * Fetch news from multiple sources with caching
     */
    async fetchAllNews(sources, type = 'NEWS') {
        const cacheKey = `agro_${type.toLowerCase()}_all`;
        const cached = cacheService.get(cacheKey);
        const ttl = TTL[type] || TTL.NEWS;

        if (cached && !cached.isExpired) {
            console.log(`⚡ Serving ${type} from Fresh Cache`);
            return cached.data;
        }

        try {
            console.log(`🌐 Fetching fresh ${type} from RSS sources...`);
            const fetchPromises = sources.map(source => this.fetchNewsFeed(source));
            const results = await Promise.all(fetchPromises);
            const flattened = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            cacheService.set(cacheKey, flattened, ttl);
            return flattened;
        } catch (error) {
            if (cached) {
                console.warn(`⚠️ ${type} fetch failed. Serving STALE Cache as fallback.`);
                return cached.data;
            }
            throw error;
        }
    }

    // Helper: Single channel fetch (used by fetchAllChannels)
    async fetchChannelVideos(channelId) {
        try {
            const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
            const feed = await parser.parseURL(url);
            return feed.items.map(item => ({
                id: item.videoId || item.id.split(':').pop(),
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                author: item.author,
                channelId: item.channelId,
                thumbnail: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
                description: item.contentSnippet || '',
                source: 'YouTube'
            }));
        } catch (error) {
            console.error(`Error fetching RSS for channel ${channelId}:`, error.message);
            return [];
        }
    }

    // Helper: Single news feed fetch (used by fetchAllNews)
    async fetchNewsFeed(source) {
        try {
            const feed = await parser.parseURL(source.url);
            return feed.items.map(item => ({
                id: item.guid || item.link,
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                author: item.author || item.creator,
                description: item.contentSnippet || item.content || '',
                source: source.name,
                category: source.category
            }));
        } catch (error) {
            console.error(`Error fetching news from ${source.name}:`, error.message);
            return [];
        }
    }
}

export default new RSSService();
