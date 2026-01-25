
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import { QUERY_KEYS } from '../constants/query-keys';
import { useToast } from '../components/Toast';

export const useOrders = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Create Order Mutation
    const createOrderMutation = useMutation({
        mutationFn: ordersAPI.create,
        onSuccess: () => {
            showToast('ઓર્ડર સફળતાપૂર્વક કરવામાં આવ્યો!', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
        },
        onError: (err: any) => {
            showToast(err.message || 'ઓર્ડર કરવામાં નિષ્ફળ.', 'error');
        }
    });

    return {
        createOrder: createOrderMutation.mutateAsync,
        isOrderCreating: createOrderMutation.isPending,
    };
};
