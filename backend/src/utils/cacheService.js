/**
 * Agriculture System Cache Service
 * Handles in-memory caching with TTL and Fallback support.
 */

class CacheService {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Set data in cache
     * @param {string} key - Unique key
     * @param {any} data - Content to cache
     * @param {number} ttlInMinutes - Time to live
     */
    set(key, data, ttlInMinutes) {
        const expiresAt = Date.now() + ttlInMinutes * 60 * 1000;
        this.cache.set(key, {
            data,
            expiresAt,
            lastUpdated: new Date().toISOString()
        });
        console.log(`💾 Cache SET for: ${key}, expires in ${ttlInMinutes} mins.`);
    }

    /**
     * Get data from cache
     * @param {string} key 
     * @returns {Object|null} - { data, isExpired }
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const isExpired = Date.now() > entry.expiresAt;
        return {
            data: entry.data,
            isExpired,
            lastUpdated: entry.lastUpdated
        };
    }

    /**
     * Clear specific key or all
     */
    clear(key = null) {
        if (key) this.cache.delete(key);
        else this.cache.clear();
    }
}

export default new CacheService();
