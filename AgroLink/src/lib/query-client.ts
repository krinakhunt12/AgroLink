import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AppLogger from '../utils/logger';

/**
 * CentraQuery Client Configuration
 * Handles global error tracking, stale times, and retry logic.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            onError: (error: any) => {
                const message = error?.message || 'Something went wrong';

                // Log technical details for developers
                AppLogger.apiError('MUTATION', 'Unknown', error);

                // Show clean, user-friendly message in UI
                toast.error(message);
            },
        },
    },
});
