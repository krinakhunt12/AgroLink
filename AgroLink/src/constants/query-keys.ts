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
} as const;
