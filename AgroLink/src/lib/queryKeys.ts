/**
 * Centralized Query Keys
 * 
 * Benefits:
 * - Predictable and reusable
 * - Type-safe
 * - Easy to invalidate related queries
 * - Prevents typos and inconsistencies
 */

export const queryKeys = {
    // Auth
    auth: {
        all: ['auth'] as const,
        me: () => [...queryKeys.auth.all, 'me'] as const,
    },

    // Products
    products: {
        all: ['products'] as const,
        lists: () => [...queryKeys.products.all, 'list'] as const,
        list: (filters?: Record<string, any>) =>
            [...queryKeys.products.lists(), filters] as const,
        details: () => [...queryKeys.products.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.products.details(), id] as const,
        byFarmer: (farmerId: string) =>
            [...queryKeys.products.all, 'farmer', farmerId] as const,
    },

    // Bids
    bids: {
        all: ['bids'] as const,
        myBids: () => [...queryKeys.bids.all, 'my-bids'] as const,
        productBids: (productId: string) =>
            [...queryKeys.bids.all, 'product', productId] as const,
    },

    // Orders
    orders: {
        all: ['orders'] as const,
        lists: () => [...queryKeys.orders.all, 'list'] as const,
        details: () => [...queryKeys.orders.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    },

    // Users
    users: {
        all: ['users'] as const,
        profile: (userId: string) => [...queryKeys.users.all, 'profile', userId] as const,
    },

    // Categories
    categories: {
        all: ['categories'] as const,
        list: () => [...queryKeys.categories.all, 'list'] as const,
    },
} as const;
