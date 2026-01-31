export const QUERY_KEYS = {
    AUTH: {
        USER: ['auth', 'user'],
    },
    PRODUCTS: {
        ALL: (filters?: any) => ['products', 'all', filters],
        DETAIL: (id: string) => ['products', 'detail', id],
        FARMER: (farmerId: string) => ['products', 'farmer', farmerId],
    },
    BIDS: {
        MY_BIDS: ['bids', 'my-bids'],
        PRODUCT_BIDS: (productId: string) => ['bids', 'product', productId],
    },
    ORDERS: {
        ALL: ['orders', 'all'],
        DETAIL: (id: string) => ['orders', 'detail', id],
    },
    USERS: {
        PROFILE: (userId: string) => ['users', 'profile', userId],
    },
    CATEGORIES: {
        ALL: ['categories', 'all'],
    },
    INTELLIGENCE: {
        PRICE_PREDICTION: (data: any) => ['intelligence', 'price-prediction', data],
        GAP_ANALYSIS: (data: any) => ['intelligence', 'gap-analysis', data],
        BUYER_TRUST: (id: string, history: any) => ['intelligence', 'buyer-trust', id, history],
        POLICY_AWARENESS: (crop: string, district: string, market: string) => ['intelligence', 'policy', crop, district, market],
        PROFIT_DASHBOARD: (transactions: any) => ['intelligence', 'profit', transactions],
    },
    BLOCKCHAIN: {
        VERIFY: ['blockchain', 'verify'],
        CONTRACT_STATUS: (id: string) => ['blockchain', 'contract', id],
    }
} as const;
