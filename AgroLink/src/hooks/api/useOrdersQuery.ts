import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import { queryKeys } from '../lib/queryKeys';
import { useToast } from '../components/Toast';
import AppLogger from '../utils/logger';

/**
 * Orders Query Hooks
 * 
 * All read operations use useQuery
 * All write operations use useMutation with automatic invalidation
 */

// ============= QUERIES (Read Operations) =============

/**
 * Fetch all orders (role-based)
 */
export const useOrders = () => {
    return useQuery({
        queryKey: queryKeys.orders.lists(),
        queryFn: async () => {
            const response = await ordersAPI.getAll();
            return response.data;
        },
    });
};

/**
 * Fetch single order by ID
 */
export const useOrder = (id: string) => {
    return useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: async () => {
            const response = await ordersAPI.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
};

// ============= MUTATIONS (Write Operations) =============

/**
 * Create a new order
 * Automatically invalidates order and product queries on success
 */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (orderData: {
            productId: string;
            quantity: number;
            deliveryAddress: string;
            paymentMethod: 'cash' | 'upi' | 'bank_transfer';
            notes?: string;
        }) => {
            return await ordersAPI.create(orderData);
        },
        onSuccess: (_, variables) => {
            // Invalidate orders to show new order
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
            // Invalidate products as stock might have changed
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

            showToast('ઓર્ડર સફળતાપૂર્વક મૂકવામાં આવ્યો છે!', 'success');
            AppLogger.info('Order created successfully', { productId: variables.productId });
        },
        onError: (error: any) => {
            showToast(error.message || 'ઓર્ડર મૂકવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to create order', error);
        },
    });
};

/**
 * Update order status (farmer only)
 * Automatically invalidates order queries on success
 */
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            id,
            status
        }: {
            id: string;
            status: string
        }) => {
            return await ordersAPI.updateStatus(id, status);
        },
        onSuccess: (_, variables) => {
            // Invalidate specific order and all order lists
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });

            showToast('ઓર્ડર સ્ટેટસ અપડેટ થઈ ગયો છે!', 'success');
            AppLogger.info('Order status updated', { orderId: variables.id, status: variables.status });
        },
        onError: (error: any) => {
            showToast(error.message || 'સ્ટેટસ અપડેટ કરવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to update order status', error);
        },
    });
};
