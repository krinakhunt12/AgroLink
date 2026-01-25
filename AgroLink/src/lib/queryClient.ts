import { QueryClient } from '@tanstack/react-query';

/**
 * Global Query Client Configuration
 * 
 * Default Settings:
 * - staleTime: 5 minutes (data considered fresh for 5 minutes)
 * - cacheTime: 10 minutes (unused data kept in cache for 10 minutes)
 * - refetchOnWindowFocus: true (refetch when user returns to tab)
 * - retry: 1 (retry failed requests once)
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
        },
        mutations: {
            retry: 1,
        },
    },
});
