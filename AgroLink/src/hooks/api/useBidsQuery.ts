import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidsAPI } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { useToast } from '../../components/Toast';
import AppLogger from '../../utils/logger';

/**
 * Bids Query Hooks
 * 
 * All read operations use useQuery
 * All write operations use useMutation with automatic invalidation
 */

// ============= QUERIES (Read Operations) =============

/**
 * Fetch user's bids (buyer only)
 */
export const useMyBids = () => {
    return useQuery({
        queryKey: queryKeys.bids.myBids(),
        queryFn: async () => {
            const response = await bidsAPI.getMyBids();
            return response.data;
        },
    });
};

/**
 * Fetch bids for a specific product (farmer only)
 */
export const useProductBids = (productId: string) => {
    return useQuery({
        queryKey: queryKeys.bids.productBids(productId),
        queryFn: async () => {
            const response = await bidsAPI.getProductBids(productId);
            return response.data;
        },
        enabled: !!productId,
    });
};

// ============= MUTATIONS (Write Operations) =============

/**
 * Create a new bid
 * Automatically invalidates bid queries on success
 */
export const useCreateBid = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (bidData: {
            productId: string;
            amount: number;
            quantity: number;
            message?: string;
        }) => {
            return await bidsAPI.create(bidData);
        },
        onSuccess: (_, variables) => {
            // Invalidate all bid queries and product-specific bids
            queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.bids.productBids(variables.productId)
            });

            showToast('બિડ સફળતાપૂર્વક મૂકવામાં આવી છે!', 'success');
            AppLogger.info('Bid created successfully', { productId: variables.productId });
        },
        onError: (error: any) => {
            showToast(error.message || 'બિડ મૂકવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to create bid', error);
        },
    });
};

/**
 * Update bid status (farmer only)
 * Automatically invalidates related queries on success
 */
export const useUpdateBidStatus = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            bidId,
            status
        }: {
            bidId: string;
            status: 'accepted' | 'rejected'
        }) => {
            return await bidsAPI.updateStatus(bidId, status);
        },
        onSuccess: (_, variables) => {
            // Invalidate all bid queries to refresh the data
            queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
            // Also invalidate orders as accepted bids might create orders
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

            const statusText = variables.status === 'accepted' ? 'સ્વીકારવામાં' : 'નકારવામાં';
            showToast(`બિડ ${statusText} આવી છે.`, 'success');
            AppLogger.info('Bid status updated', { bidId: variables.bidId, status: variables.status });
        },
        onError: (error: any) => {
            showToast(error.message || 'એક્શન લેવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to update bid status', error);
        },
    });
};
