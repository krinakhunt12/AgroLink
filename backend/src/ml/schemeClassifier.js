/**
 * Specialized Keyword-based Classifier for Government Schemes
 * Identifies agriculture-related schemes and official farmer announcements.
 */

const SCHEME_KEYWORDS = [
    // Core Financial Support
    'pm-kisan', 'kisan samman nidhi', 'msp', 'minimum support price', 'subsidy', 'loan', 'credit',
    'payout', 'financial assistance', 'compensation', 'insurance', 'crop insurance', 'pmfby',

    // Infrastructure & Irrigation
    'irrigation', 'pmksy', 'solar pump', 'kusum', 'tubewell', 'warehouse', 'storage', 'infrastructure',
    'cold storage', 'micro-irrigation', 'drip', 'sprinkler',

    // Soil & inputs
    'soil health card', 'pesticide subsidy', 'fertilizer subsidy', 'urea', 'npk', 'neem coated',
    'seeds', 'organic farming', 'pkvy', 'natural farming', 'paramparagat',

    // Marketing & Digital India
    'e-nam', 'mandi', 'market infrastructure', 'digital agriculture', 'agristack',
    'startup', 'agri-export', 'apmc reform',

    // Extension & Training
    'training', 'skilling', 'kvk', 'kisan vigyan kendra', 'workshop', 'demonstration',
    'atma', 'krishi darshan',

    // Specific Initiatives
    'announcement', 'launch', 'scheme', 'yojana', 'initiative', 'program', 'portal'
];

const NOISE_KEYWORDS = [
    'cricket', 'bollywood', 'celebrity', 'election campaign', 'political rally',
    'scandal', 'movie', 'sports', 'entertainment'
];

/**
 * Classifies the content and determines if it qualifies as a useful government scheme
 * @param {string} title 
 * @param {string} description 
 */
export const classifyScheme = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();

    // 1. Filter out obvious noise
    const holdsNoise = NOISE_KEYWORDS.some(word => text.includes(word));
    if (holdsNoise) return { isUseful: false, score: 0 };

    // 2. Count agriculture scheme keywords
    let matchCount = 0;
    SCHEME_KEYWORDS.forEach(word => {
        if (text.includes(word)) {
            matchCount++;
            // Bonus for phrases like "PM-Kisan" or "MSP"
            if (word.length > 5) matchCount += 0.5;
        }
    });

    // 3. Determine specific category
    let category = 'GENERAL_WELFARE';
    if (text.includes('subsidy') || text.includes('financial') || text.includes('loan')) category = 'FINANCIAL_AID';
    else if (text.includes('insurance') || text.includes('pmfby') || text.includes('compensation')) category = 'INSURANCE';
    else if (text.includes('irrigation') || text.includes('water') || text.includes('pmksy')) category = 'INFRASTRUCTURE';
    else if (text.includes('soil') || text.includes('fertilizer') || text.includes('seed')) category = 'INPUT_SUPPORT';
    else if (text.includes('mandi') || text.includes('e-nam') || text.includes('msp')) category = 'MARKETING';

    return {
        isUseful: matchCount >= 1, // At least one keyword match
        score: matchCount,
        category: category
    };
};
