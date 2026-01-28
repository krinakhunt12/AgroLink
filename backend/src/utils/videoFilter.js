/**
 * Filtering logic to identify useful agriculture videos
 */

const USEFUL_KEYWORDS = [
    'farming', 'kheti', 'crop', 'price', 'mandi', 'bhav', 'disease', 'pest',
    'fertilizer', 'irrigation', 'weather', 'cultivation', 'harvest', 'yield',
    'subsidy', 'scheme', 'tractor', 'technique', 'organic', 'soil', 'seeds',
    'cattle', 'dairy', 'poultry', 'modern farming', 'hydroponic', 'polyhouse'
];

const EXCLUDE_KEYWORDS = [
    'vlog', 'entertainment', 'comedy', 'funny', 'challenge', 'prank',
    'movie', 'song', 'music', 'gaming', 'unboxing'
];

/**
 * Checks if a video is useful based on its title and description
 * @param {Object} video 
 * @returns {boolean}
 */
export const isUsefulVideo = (video) => {
    const title = video.title.toLowerCase();
    const description = video.description.toLowerCase();
    const combinedText = `${title} ${description}`;

    // 1. Check for excluded categories
    const containsExclude = EXCLUDE_KEYWORDS.some(word => title.includes(word));
    if (containsExclude) return false;

    // 2. Check for useful keywords
    const containsUseful = USEFUL_KEYWORDS.some(word => combinedText.includes(word));

    // ML-inspired rule: If it has more than 1 useful keyword or is from a trusted author, it's more likely useful
    // In this case, we are already fetching from trusted channels, so we just want to filter out non-agro content

    return containsUseful;
};

/**
 * Categories the video based on content
 * @param {string} text 
 */
export const categorizeVideo = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('price') || lower.includes('mandi') || lower.includes('bhav'))
        return 'Market Price';
    if (lower.includes('disease') || lower.includes('pest') || lower.includes('fungus'))
        return 'Plant Protection';
    if (lower.includes('weather') || lower.includes('rain'))
        return 'Weather Alert';
    if (lower.includes('fertilizer') || lower.includes('manure'))
        return 'Soil & Nutrition';
    if (lower.includes('scheme') || lower.includes('subsidy'))
        return 'Govt Schemes';

    return 'Farming Guide';
};
