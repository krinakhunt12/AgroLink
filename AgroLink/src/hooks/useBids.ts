
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidsAPI } from '../services/api';
import { QUERY_KEYS } from '../constants/query-keys';
import { useToast } from '../components/Toast';

export const useBids = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Create Bid Mutation
    const createBidMutation = useMutation({
        mutationFn: bidsAPI.create,
        onSuccess: (_, variables) => {
            showToast('બોલી સફળતાપૂર્વક મૂકવામાં આવી!', 'success');
            // Invalidate product bids list if we were viewing it
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BIDS.PRODUCT_BIDS(variables.productId) });
            // Invalidate my bids list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BIDS.MY_BIDS });
        },
        onError: (err: any) => {
            showToast(err.message || 'બોલી મૂકવામાં નિષ્ફળ.', 'error');
        }
    });

    // Fetch My Bids (Example of read operation)
    const { data: myBids, isLoading: isMyBidsLoading } = useQuery({
        queryKey: QUERY_KEYS.BIDS.MY_BIDS,
        queryFn: async () => {
            const res = await bidsAPI.getMyBids();
            return res.data;
        },
        // We typically don't want auth errors to retry too much, relying on global config
    });

    return {
        createBid: createBidMutation.mutateAsync, // Using mutateAsync to allow await in components if needed
        isBidCreating: createBidMutation.isPending,
        myBids,
        isMyBidsLoading
    };
};
