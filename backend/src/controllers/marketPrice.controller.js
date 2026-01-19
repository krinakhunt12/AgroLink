import axios from 'axios';

// Base URL for the Market Price API
const MARKET_PRICE_API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

/**
 * Test endpoint to verify API connection
 * @route GET /api/market-prices/test
 * @access Public
 */
export const testApiConnection = async (req, res) => {
    try {
        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            limit: 5
        };

        console.log('Testing API with URL:', MARKET_PRICE_API_BASE_URL);
        console.log('API Key (first 10 chars):', process.env.MARKET_PRICE_API_KEY?.substring(0, 10));

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        res.status(200).json({
            success: true,
            message: 'API connection successful',
            responseStructure: {
                status: response.status,
                dataKeys: Object.keys(response.data),
                total: response.data.total,
                count: response.data.count,
                limit: response.data.limit,
                offset: response.data.offset,
                recordsReceived: response.data.records?.length || 0,
                sampleRecord: response.data.records?.[0] || null
            },
            fullResponse: response.data
        });
    } catch (error) {
        console.error('API Test Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'API connection failed',
            error: error.message,
            details: error.response?.data
        });
    }
};


/**
 * Get current market prices for various commodities
 * @route GET /api/market-prices
 * @access Public
 */
export const getMarketPrices = async (req, res) => {
    try {
        const {
            state,
            district,
            market,
            commodity,
            limit = 10,
            offset = 0,
            format = 'json'
        } = req.query;

        // Build query parameters
        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format,
            limit,
            offset
        };

        // Add optional filters
        if (state) params['filters[state]'] = state;
        if (district) params['filters[district]'] = district;
        if (market) params['filters[market]'] = market;
        if (commodity) params['filters[commodity]'] = commodity;

        // Make API request
        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch market prices',
            error: error.message
        });
    }
};

/**
 * Get unique states available in the market price data
 * @route GET /api/market-prices/states
 * @access Public
 */
export const getStates = async (req, res) => {
    try {
        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            limit: 1000 // Get more records to extract unique states
        };

        console.log('Fetching states with params:', params);
        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        console.log('API Response status:', response.status);
        console.log('API Response data keys:', Object.keys(response.data));
        console.log('Total records in response:', response.data.total);
        console.log('Records count:', response.data.records?.length);

        // Check if records exist
        if (!response.data.records || response.data.records.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
                message: 'No records found in API response',
                debug: {
                    total: response.data.total,
                    receivedRecords: response.data.records?.length || 0
                }
            });
        }

        // Extract unique states
        const states = [...new Set(response.data.records.map(record => record.state))].sort();

        res.status(200).json({
            success: true,
            count: states.length,
            data: states
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        console.error('Full error:', error.response?.data || error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch states',
            error: error.message,
            details: error.response?.data
        });
    }
};

/**
 * Get districts for a specific state
 * @route GET /api/market-prices/districts/:state
 * @access Public
 */
export const getDistrictsByState = async (req, res) => {
    try {
        const { state } = req.params;

        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            'filters[state]': state,
            limit: 1000
        };

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        // Extract unique districts
        const districts = [...new Set(response.data.records.map(record => record.district))].sort();

        res.status(200).json({
            success: true,
            state,
            count: districts.length,
            data: districts
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch districts',
            error: error.message
        });
    }
};

/**
 * Get markets for a specific district
 * @route GET /api/market-prices/markets/:state/:district
 * @access Public
 */
export const getMarketsByDistrict = async (req, res) => {
    try {
        const { state, district } = req.params;

        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            'filters[state]': state,
            'filters[district]': district,
            limit: 1000
        };

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        // Extract unique markets
        const markets = [...new Set(response.data.records.map(record => record.market))].sort();

        res.status(200).json({
            success: true,
            state,
            district,
            count: markets.length,
            data: markets
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch markets',
            error: error.message
        });
    }
};

/**
 * Get unique commodities
 * @route GET /api/market-prices/commodities
 * @access Public
 */
export const getCommodities = async (req, res) => {
    try {
        const { state, district } = req.query;

        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            limit: 1000
        };

        if (state) params['filters[state]'] = state;
        if (district) params['filters[district]'] = district;

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        // Extract unique commodities
        const commodities = [...new Set(response.data.records.map(record => record.commodity))].sort();

        res.status(200).json({
            success: true,
            count: commodities.length,
            data: commodities
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch commodities',
            error: error.message
        });
    }
};

/**
 * Get price statistics for a specific commodity
 * @route GET /api/market-prices/stats/:commodity
 * @access Public
 */
export const getCommodityStats = async (req, res) => {
    try {
        const { commodity } = req.params;
        const { state, district } = req.query;

        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            'filters[commodity]': commodity,
            limit: 1000
        };

        if (state) params['filters[state]'] = state;
        if (district) params['filters[district]'] = district;

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        const records = response.data.records;

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No data found for the specified commodity'
            });
        }

        // Calculate statistics
        const prices = records.map(r => r.modal_price).filter(p => p > 0);
        const minPrices = records.map(r => r.min_price).filter(p => p > 0);
        const maxPrices = records.map(r => r.max_price).filter(p => p > 0);

        const stats = {
            commodity,
            totalRecords: records.length,
            modalPrice: {
                average: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
                min: Math.min(...prices),
                max: Math.max(...prices)
            },
            priceRange: {
                lowestMin: Math.min(...minPrices),
                highestMax: Math.max(...maxPrices)
            },
            markets: [...new Set(records.map(r => r.market))].length,
            lastUpdated: records[0]?.arrival_date || 'N/A'
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch commodity statistics',
            error: error.message
        });
    }
};

/**
 * Search market prices with multiple filters
 * @route POST /api/market-prices/search
 * @access Public
 */
export const searchMarketPrices = async (req, res) => {
    try {
        const {
            state,
            district,
            market,
            commodity,
            variety,
            minPrice,
            maxPrice,
            limit = 50,
            offset = 0
        } = req.body;

        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            limit,
            offset
        };

        // Add filters
        if (state) params['filters[state]'] = state;
        if (district) params['filters[district]'] = district;
        if (market) params['filters[market]'] = market;
        if (commodity) params['filters[commodity]'] = commodity;
        if (variety) params['filters[variety]'] = variety;

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        let records = response.data.records;

        // Apply client-side price filtering if needed
        if (minPrice || maxPrice) {
            records = records.filter(record => {
                const price = record.modal_price;
                if (minPrice && price < minPrice) return false;
                if (maxPrice && price > maxPrice) return false;
                return true;
            });
        }

        res.status(200).json({
            success: true,
            total: response.data.total,
            count: records.length,
            limit,
            offset,
            data: records
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to search market prices',
            error: error.message
        });
    }
};

/**
 * Compare prices across different markets for a commodity
 * @route GET /api/market-prices/compare/:commodity
 * @access Public
 */
export const comparePrices = async (req, res) => {
    try {
        const { commodity } = req.params;
        const { state } = req.query;

        const params = {
            'api-key': process.env.MARKET_PRICE_API_KEY,
            format: 'json',
            'filters[commodity]': commodity,
            limit: 1000
        };

        if (state) params['filters[state]'] = state;

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        const records = response.data.records;

        // Group by market
        const marketComparison = records.reduce((acc, record) => {
            const key = `${record.state} - ${record.district} - ${record.market}`;
            if (!acc[key]) {
                acc[key] = {
                    state: record.state,
                    district: record.district,
                    market: record.market,
                    prices: []
                };
            }
            acc[key].prices.push({
                variety: record.variety,
                grade: record.grade,
                minPrice: record.min_price,
                maxPrice: record.max_price,
                modalPrice: record.modal_price,
                arrivalDate: record.arrival_date
            });
            return acc;
        }, {});

        // Calculate average for each market
        const comparison = Object.values(marketComparison).map(market => ({
            ...market,
            averagePrice: (market.prices.reduce((sum, p) => sum + p.modalPrice, 0) / market.prices.length).toFixed(2),
            recordCount: market.prices.length
        })).sort((a, b) => parseFloat(a.averagePrice) - parseFloat(b.averagePrice));

        res.status(200).json({
            success: true,
            commodity,
            totalMarkets: comparison.length,
            data: comparison
        });
    } catch (error) {
        console.error('Market Price API Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to compare prices',
            error: error.message
        });
    }
};
