import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MARKET_PRICE_ENDPOINT = `${API_BASE_URL}/api/market-prices`;

// Types
export interface MarketPriceRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    grade: string;
    arrival_date: string;
    min_price: number;
    max_price: number;
    modal_price: number;
}

export interface MarketPriceResponse {
    success: boolean;
    data: {
        total: number;
        count: number;
        limit: string;
        offset: string;
        records: MarketPriceRecord[];
    };
}

export interface CommodityStats {
    commodity: string;
    totalRecords: number;
    modalPrice: {
        average: string;
        min: number;
        max: number;
    };
    priceRange: {
        lowestMin: number;
        highestMax: number;
    };
    markets: number;
    lastUpdated: string;
}

export interface MarketComparison {
    state: string;
    district: string;
    market: string;
    averagePrice: string;
    recordCount: number;
    prices: Array<{
        variety: string;
        grade: string;
        minPrice: number;
        maxPrice: number;
        modalPrice: number;
        arrivalDate: string;
    }>;
}

export interface SearchFilters {
    state?: string;
    district?: string;
    market?: string;
    commodity?: string;
    variety?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
}

/**
 * Market Price Service
 * Provides methods to interact with the Market Price API
 */
export const marketPriceService = {
    /**
     * Get market prices with optional filters
     */
    getMarketPrices: async (filters?: {
        state?: string;
        district?: string;
        market?: string;
        commodity?: string;
        limit?: number;
        offset?: number;
    }): Promise<MarketPriceResponse> => {
        try {
            const response = await axios.get(MARKET_PRICE_ENDPOINT, { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching market prices:', error);
            throw error;
        }
    },

    /**
     * Get all available states
     */
    getStates: async (): Promise<{ success: boolean; count: number; data: string[] }> => {
        try {
            const response = await axios.get(`${MARKET_PRICE_ENDPOINT}/states`);
            return response.data;
        } catch (error) {
            console.error('Error fetching states:', error);
            throw error;
        }
    },

    /**
     * Get districts for a specific state
     */
    getDistrictsByState: async (state: string): Promise<{
        success: boolean;
        state: string;
        count: number;
        data: string[];
    }> => {
        try {
            const response = await axios.get(`${MARKET_PRICE_ENDPOINT}/districts/${encodeURIComponent(state)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching districts:', error);
            throw error;
        }
    },

    /**
     * Get markets for a specific district in a state
     */
    getMarketsByDistrict: async (state: string, district: string): Promise<{
        success: boolean;
        state: string;
        district: string;
        count: number;
        data: string[];
    }> => {
        try {
            const response = await axios.get(
                `${MARKET_PRICE_ENDPOINT}/markets/${encodeURIComponent(state)}/${encodeURIComponent(district)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching markets:', error);
            throw error;
        }
    },

    /**
     * Get all available commodities
     */
    getCommodities: async (filters?: {
        state?: string;
        district?: string;
    }): Promise<{ success: boolean; count: number; data: string[] }> => {
        try {
            const response = await axios.get(`${MARKET_PRICE_ENDPOINT}/commodities`, { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching commodities:', error);
            throw error;
        }
    },

    /**
     * Get statistics for a specific commodity
     */
    getCommodityStats: async (
        commodity: string,
        filters?: { state?: string; district?: string }
    ): Promise<{ success: boolean; data: CommodityStats }> => {
        try {
            const response = await axios.get(
                `${MARKET_PRICE_ENDPOINT}/stats/${encodeURIComponent(commodity)}`,
                { params: filters }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching commodity stats:', error);
            throw error;
        }
    },

    /**
     * Compare prices across different markets for a commodity
     */
    comparePrices: async (
        commodity: string,
        state?: string
    ): Promise<{
        success: boolean;
        commodity: string;
        totalMarkets: number;
        data: MarketComparison[];
    }> => {
        try {
            const response = await axios.get(
                `${MARKET_PRICE_ENDPOINT}/compare/${encodeURIComponent(commodity)}`,
                { params: { state } }
            );
            return response.data;
        } catch (error) {
            console.error('Error comparing prices:', error);
            throw error;
        }
    },

    /**
     * Advanced search with multiple filters
     */
    searchPrices: async (searchParams: SearchFilters): Promise<{
        success: boolean;
        total: number;
        count: number;
        limit: number;
        offset: number;
        data: MarketPriceRecord[];
    }> => {
        try {
            const response = await axios.post(`${MARKET_PRICE_ENDPOINT}/search`, searchParams);
            return response.data;
        } catch (error) {
            console.error('Error searching prices:', error);
            throw error;
        }
    },

    /**
     * Get latest prices for a specific commodity
     */
    getLatestPrices: async (commodity: string, limit: number = 10): Promise<MarketPriceResponse> => {
        try {
            const response = await axios.get(MARKET_PRICE_ENDPOINT, {
                params: { commodity, limit, offset: 0 }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching latest prices:', error);
            throw error;
        }
    },

    /**
     * Get prices for a specific location
     */
    getPricesByLocation: async (
        state: string,
        district?: string,
        market?: string,
        limit: number = 20
    ): Promise<MarketPriceResponse> => {
        try {
            const params: any = { state, limit };
            if (district) params.district = district;
            if (market) params.market = market;

            const response = await axios.get(MARKET_PRICE_ENDPOINT, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching prices by location:', error);
            throw error;
        }
    },
};

export default marketPriceService;
