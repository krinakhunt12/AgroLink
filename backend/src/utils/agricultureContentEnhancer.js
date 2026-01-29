/**
 * Agriculture Content Enhancer Utility
 * Handles scoring, ranking, and smart search for agriculture content.
 */

const TRUSTED_SOURCES = [
    'PIB', 'Ministry of Agriculture', 'ICAR', 'DD Kisan',
    'Indian Express Agriculture', 'Agrowon', 'The Hindu Agriculture'
];

const SCHEME_KEYWORDS = {
    'PM-KISAN': ['pm-kisan', 'kisan samman nidhi', 'pm kisan installment', 'nidhi'],
    'PMFBY': ['pmfby', 'fasal bima', 'crop insurance', 'bima yojana'],
    'KCC': ['kcc', 'kisan credit card', 'loan interest'],
    'Subsidies': ['subsidy', 'sahay', 'subsidi', 'component', 'grant'],
    'MSP': ['msp', 'minimum support price', 'tekana bhav', 'guarantee price']
};

/**
 * Calculates a usefulness score for an item
 * @param {Object} item - The content item
 * @returns {number} - Relevance score (0-100)
 */
export const calculateUsefulnessScore = (item) => {
    let score = 0;
    const text = `${item.title} ${item.description}`.toLowerCase();

    // 1. Keyword overlap (Weight: 40%)
    const keywords = ['farming', 'crop', 'disease', 'price', 'irrigation', 'seeds', 'fertilizer', 'scheme'];
    let matches = 0;
    keywords.forEach(kw => {
        if (text.includes(kw)) matches++;
    });
    score += Math.min(matches * 8, 40);

    // 2. Source Priority (Weight: 30%)
    const isTrusted = TRUSTED_SOURCES.some(source =>
        item.source.toLowerCase().includes(source.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(source.toLowerCase()))
    );
    if (isTrusted) score += 30;

    // 3. Recency (Weight: 30%)
    const pubDate = new Date(item.pubDate);
    const now = new Date();
    const diffDays = (now - pubDate) / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) score += 30;
    else if (diffDays <= 7) score += 20;
    else if (diffDays <= 30) score += 10;

    return score;
};

/**
 * Detects and tags government schemes from text
 * @param {string} text - Title/Description
 * @returns {Array} - List of detected schemes
 */
export const detectSchemes = (text) => {
    const content = text.toLowerCase();
    const found = [];

    Object.entries(SCHEME_KEYWORDS).forEach(([scheme, synonyms]) => {
        if (synonyms.some(syn => content.includes(syn))) {
            found.push(scheme);
        }
    });

    return found;
};

/**
 * Filters content based on date range string
 * @param {Array} items 
 * @param {string} filter - 'Today', 'Last 7 Days', 'Last 30 Days'
 */
export const filterByDate = (items, filter) => {
    const now = new Date();
    let cutoff = new Date(0); // Epoch

    if (filter === 'Today') {
        cutoff = new Date(now.setHours(0, 0, 0, 0));
    } else if (filter === 'Last 7 Days') {
        cutoff = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === 'Last 30 Days') {
        cutoff = new Date(now.setDate(now.getDate() - 30));
    }

    return items.filter(item => new Date(item.pubDate) >= cutoff);
};

/**
 * Smart keyword-based search
 * @param {Array} items 
 * @param {string} query 
 */
export const smartSearch = (items, query) => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
    );
};
