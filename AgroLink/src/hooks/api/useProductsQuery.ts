import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { useToast } from '../../components/Toast';
import AppLogger from '../../utils/logger';

/**
 * Products Query Hooks
 * 
 * All read operations use useQuery
 * All write operations use useMutation with automatic invalidation
 */

// ============= QUERIES (Read Operations) =============

/**
 * Fetch all products with optional filters
 */
export const useProducts = (filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isNegotiable?: boolean;
}) => {
    return useQuery({
        queryKey: queryKeys.products.list(filters),
        queryFn: async () => {
            const response = await productsAPI.getAll(filters);
            // Map _id to id for consistency
            return response.data.map((p: any) => ({
                ...p,
                id: p._id || p.id,
            }));
        },
    });
};

/**
 * Fetch single product by ID
 */
export const useProduct = (id: string) => {
    return useQuery({
        queryKey: queryKeys.products.detail(id),
        queryFn: async () => {
            const response = await productsAPI.getById(id);
            return {
                ...response.data,
                id: response.data._id || response.data.id,
            };
        },
        enabled: !!id, // Only run if id exists
    });
};

/**
 * Fetch products by farmer ID
 */
export const useProductsByFarmer = (farmerId: string) => {
    return useQuery({
        queryKey: queryKeys.products.byFarmer(farmerId),
        queryFn: async () => {
            const response = await productsAPI.getByFarmer(farmerId);
            return response.data.map((p: any) => ({
                ...p,
                id: p._id || p.id,
            }));
        },
        enabled: !!farmerId,
    });
};

// ============= MUTATIONS (Write Operations) =============

/**
 * Create new product
 * Automatically invalidates all product queries on success
 */
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (productData: FormData) => {
            return await productsAPI.create(productData);
        },
        onSuccess: () => {
            // Invalidate all product-related queries to trigger automatic refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

            showToast('ઉત્પાદન સફળતાપૂર્વક ઉમેરવામાં આવ્યું છે!', 'success');
            AppLogger.info('Product created successfully');
        },
        onError: (error: any) => {
            showToast(error.message || 'ઉત્પાદન ઉમેરવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to create product', error);
        },
    });
};

/**
 * Update existing product
 * Automatically invalidates related product queries on success
 */
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            return await productsAPI.update(id, data);
        },
        onSuccess: (_, variables) => {
            // Invalidate specific product and all product lists
            queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

            showToast('ઉત્પાદન અપડેટ થઈ ગયું છે!', 'success');
            AppLogger.info('Product updated successfully', { productId: variables.id });
        },
        onError: (error: any) => {
            showToast(error.message || 'ઉત્પાદન અપડેટ કરવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to update product', error);
        },
    });
};

/**
 * Delete product
 * Automatically invalidates all product queries on success
 */
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            return await productsAPI.delete(id);
        },
        onSuccess: (_, productId) => {
            // Invalidate all product-related queries
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

            showToast('જાહેરાત કાઢી નાખવામાં આવી છે.', 'success');
            AppLogger.info('Product deleted successfully', { productId });
        },
        onError: (error: any) => {
            showToast(error.message || 'જાહેરાત કાઢી નાખવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to delete product', error);
        },
    });
};
