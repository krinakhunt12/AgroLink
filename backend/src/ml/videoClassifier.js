/**
 * ML-inspired Keyword-based Classifier for Agriculture Videos
 * Identifies useful videos and filters out non-agriculture content.
 */

// Comprehensive list of keywords for useful agriculture content
const AGRICULTURE_KEYWORDS = [
  // Core Crop/Farm Management
  'farming', 'agriculture', 'kheti', 'kisani', 'crop', 'harvest', 'cultivation',
  'planting', 'seeds', 'soil', 'yield', 'organic', 'modern farming',

  // Plant Protection & Care
  'disease', 'pest', 'fungus', 'pesticide', 'insecticide', 'fertilizer',
  'manure', 'compost', 'urea', 'npk',

  // Resource Management
  'irrigation', 'water', 'drip', 'sprinkler', 'tubewell', 'weather', 'rain',

  // Market & Economics
  'price', 'mandi', 'bhav', 'market', 'subsidy', 'scheme', 'yojana', 'loan', 'insurance',

  // Equipment
  'tractor', 'trolley', 'plough', 'harvester', 'implement', 'technology',

  // Specialized Farming
  'hydroponic', 'polyhouse', 'greenhouse', 'mushroom', 'dairy', 'cattle',
  'poultry', 'goat', 'fish', 'beekeeping'
];

// Keywords that indicate non-useful or entertainment-only content
const NON_USEFUL_KEYWORDS = [
  'vlog', 'entertainment', 'prank', 'comedy', 'funny', 'challenge',
  'reaction', 'movie', 'song', 'music', 'gaming', 'unboxing', 'dance'
];

/**
 * Classifies the video and determines its usefulness score
 * @param {string} title 
 * @param {string} description 
 */
export const classifyVideo = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // 1. Check for negative keywords (Vlogs, etc.)
  const containsNegative = NON_USEFUL_KEYWORDS.some(word => text.includes(word));
  if (containsNegative) return { isUseful: false, score: 0, category: 'ENTERTAINMENT' };

  // 2. Calculate usefulness score based on keyword match count
  let matchCount = 0;
  AGRICULTURE_KEYWORDS.forEach(word => {
    if (text.includes(word)) matchCount++;
  });

  // 3. Determine category
  let category = 'GENERAL_FARMING';
  if (text.includes('price') || text.includes('mandi') || text.includes('bhav')) category = 'MARKET_PRICE';
  else if (text.includes('disease') || text.includes('pest') || text.includes('fungus')) category = 'PLANT_PROTECTION';
  else if (text.includes('weather') || text.includes('rain')) category = 'WEATHER_ALERT';
  else if (text.includes('fertilizer') || text.includes('manure')) category = 'SOIL_NUTRITION';
  else if (text.includes('scheme') || text.includes('subsidy') || text.includes('yojana')) category = 'GOVT_SCHEME';
  else if (text.includes('tractor') || text.includes('technology')) category = 'FARM_TECH';

  return {
    isUseful: matchCount > 0,
    score: matchCount,
    category: category
  };
};
