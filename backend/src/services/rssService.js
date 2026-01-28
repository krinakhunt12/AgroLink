import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: [
            ['media:group', 'mediaGroup'],
            ['yt:videoId', 'videoId'],
            ['yt:channelId', 'channelId']
        ]
    }
});

/**
 * Service to fetch YouTube videos via RSS
 * No API Key required.
 */
class RSSService {
    /**
     * Fetch videos from a single channel RSS feed
     * @param {string} channelId 
     */
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
                description: item.contentSnippet || ''
            }));
        } catch (error) {
            console.error(`Error fetching RSS for channel ${channelId}:`, error.message);
            return [];
        }
    }

    /**
     * Fetch videos from multiple channels
     * @param {Array} channels - Array of objects with {id, name}
     */
    async fetchAllChannels(channels) {
        const fetchPromises = channels.map(channel => this.fetchChannelVideos(channel.id));
        const results = await Promise.all(fetchPromises);

        // Flatten the array of arrays and sort by date
        return results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    }
}

export default new RSSService();
