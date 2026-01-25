import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';

/**
 * Categories Query Hooks
 * 
 * Categories are typically read-only from the frontend
 */

// ============= QUERIES (Read Operations) =============

/**
 * Fetch all categories
 */
export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.categories.list(),
        queryFn: async () => {
            const response = await categoriesAPI.getAll();
            return response.data;
        },
        // Categories change rarely, so we can cache them longer
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};
