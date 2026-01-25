import axios from 'axios';
import * as xlsx from 'xlsx';
import MarketPrice from '../models/MarketPrice.model.js';
import logger, { LogCategory } from '../utils/logger.js';

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

        logger.externalApiRequest('MarketPriceAPI', 'GET', MARKET_PRICE_API_BASE_URL, {
            featureName: 'MarketPrice',
            endpoint: '/api/market-prices/test',
            apiKeyPrefix: process.env.MARKET_PRICE_API_KEY?.substring(0, 10)
        });

        const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });

        logger.externalApiResponse('MarketPriceAPI', 'GET', MARKET_PRICE_API_BASE_URL, response.status, {
            featureName: 'MarketPrice',
            endpoint: '/api/market-prices/test',
            recordsReceived: response.data.records?.length || 0
        });

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
        logger.externalApiError('MarketPriceAPI', 'GET', MARKET_PRICE_API_BASE_URL, error, {
            featureName: 'MarketPrice',
            endpoint: '/api/market-prices/test'
        });

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
            variety,
            grade,
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
        if (variety) params['filters[variety]'] = variety;
        if (grade) params['filters[grade]'] = grade;

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

/**
 * Import market prices from Excel file
 * @route POST /api/market-prices/import
 * @access Admin/Farmer
 */
export const importFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({ success: false, message: 'Excel file is empty' });
        }

        const records = [];
        let skipped = 0;
        let imported = 0;

        for (const row of data) {
            try {
                // Header mapping (Normalization)
                const state = row['State'] || row['state'];
                const district = row['District'] || row['district'];
                const market = row['Market'] || row['market'];
                const commodity = row['Commodity'] || row['commodity'];
                const variety = row['Variety'] || row['variety'] || 'Local';
                const arrivalDateStr = row['Arrival_Date'] || row['arrival_date'] || row['Date'] || '25/01/2026';
                const minPrice = parseFloat(String(row['Min Price'] || row['min_price']).replace(/,/g, ''));
                const maxPrice = parseFloat(String(row['Max Price'] || row['max_price']).replace(/,/g, ''));
                const modalPrice = parseFloat(String(row['Modal Price'] || row['modal_price']).replace(/,/g, ''));

                if (!state || !market || !commodity || isNaN(modalPrice)) {
                    skipped++;
                    continue;
                }

                // Parse date DD/MM/YYYY
                const [day, month, year] = arrivalDateStr.split('/');
                const parsedDate = new Date(year, month - 1, day);

                const record = {
                    state,
                    district,
                    market,
                    commodity,
                    variety,
                    grade: row['Grade'] || 'FAQ',
                    arrival_date: arrivalDateStr,
                    parsed_date: parsedDate,
                    min_price: minPrice,
                    max_price: maxPrice,
                    modal_price: modalPrice,
                    source: 'EXCEL'
                };

                // Use updateOne with upsert to prevent duplicates
                await MarketPrice.updateOne(
                    { state, district, market, commodity, variety, arrival_date: arrivalDateStr },
                    { $set: record },
                    { upsert: true }
                );

                imported++;
            } catch (err) {
                console.error('Error processing row:', row, err);
                skipped++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Import completed: ${imported} imported, ${skipped} skipped`,
            details: { imported, skipped }
        });

    } catch (error) {
        console.error('Import Error:', error);
        res.status(500).json({ success: false, message: 'Failed to import Excel data', error: error.message });
    }
};

/**
 * Predict current/future price based on historical data
 * @route GET /api/market-prices/predict
 * @access Public
 */
export const predictPrice = async (req, res) => {
    try {
        const { state, district, market, commodity, variety } = req.query;

        if (!commodity || !state) {
            return res.status(400).json({
                success: false,
                message: 'Commodity and State are required for prediction'
            });
        }

        // --- STEP 1: Search in Local Database (Excel Data) first ---
        const localFilter = { state, commodity };
        if (district) localFilter.district = district;
        if (market) localFilter.market = market;
        if (variety) localFilter.variety = variety;

        let historicalRecords = await MarketPrice.find(localFilter).sort({ parsed_date: 1 });

        // --- STEP 2: Fallback to GOV API if local data is insufficient ---
        if (historicalRecords.length < 5) {
            const params = {
                'api-key': process.env.MARKET_PRICE_API_KEY,
                format: 'json',
                limit: 100,
                'filters[state]': state,
                'filters[commodity]': commodity
            };

            if (district) params['filters[district]'] = district;
            if (market) params['filters[market]'] = market;
            if (variety) params['filters[variety]'] = variety;

            const response = await axios.get(MARKET_PRICE_API_BASE_URL, { params });
            const apiRecords = response.data.records || [];

            // Convert API records to unified format for prediction
            const unifiedRecords = apiRecords.map(r => ({
                modal_price: r.modal_price,
                arrival_date: r.arrival_date
            }));

            // Merge or use API records
            if (unifiedRecords.length > 0) {
                historicalRecords = [...historicalRecords, ...unifiedRecords];
            }
        }

        if (historicalRecords.length < 3) {
            return res.status(404).json({
                success: false,
                message: 'Insufficient historical data (minimum 3 days required) to generate a prediction. Please upload more Excel history.'
            });
        }

        // 3. Prepare data for Regression
        const modalPrices = historicalRecords.map(r => parseFloat(String(r.modal_price).replace(/,/g, '')));
        const n = modalPrices.length;

        // 4. Linear Regression
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += modalPrices[i];
            sumXY += i * modalPrices[i];
            sumXX += i * i;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const predictedPrice = Math.round(slope * n + intercept);
        const confidence = n > 20 ? 'High' : (n > 10 ? 'Medium' : 'Low');
        const trend = slope > 1 ? 'Bullish (Strong)' : (slope > 0 ? 'Bullish' : (slope < -1 ? 'Bearish (Strong)' : (slope < 0 ? 'Bearish' : 'Stable')));

        res.status(200).json({
            success: true,
            data: {
                commodity,
                variety: variety || 'All',
                market: market || 'All',
                sourceUsed: historicalRecords[0]?.source || 'API/Mixed',
                prediction: {
                    todayPredictedPrice: predictedPrice,
                    trend,
                    confidence,
                    slope: slope.toFixed(2),
                    totalDataPoints: n
                },
                currentMarketPrice: modalPrices[n - 1],
                historicalMovement: {
                    start: modalPrices[0],
                    end: modalPrices[n - 1],
                    change: (modalPrices[n - 1] - modalPrices[0]).toFixed(2)
                }
            }
        });

    } catch (error) {
        console.error('Prediction API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate price prediction',
            error: error.message
        });
    }
};
