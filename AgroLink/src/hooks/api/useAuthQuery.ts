import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { queryKeys } from '../lib/queryKeys';
import { useToast } from '../components/Toast';
import AppLogger from '../utils/logger';

/**
 * Auth Query Hooks
 * 
 * Handles authentication operations
 */

// ============= QUERIES (Read Operations) =============

/**
 * Fetch current authenticated user
 */
export const useMe = () => {
    return useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => {
            const response = await authAPI.getMe();
            return response.data;
        },
        enabled: authAPI.isAuthenticated(),
        retry: false, // Don't retry if unauthorized
    });
};

// ============= MUTATIONS (Write Operations) =============

/**
 * Register new user
 * Automatically invalidates auth queries on success
 */
export const useRegister = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (userData: {
            name: string;
            phone: string;
            password: string;
            userType: 'farmer' | 'buyer';
            location: string;
        }) => {
            return await authAPI.register(userData);
        },
        onSuccess: () => {
            // Invalidate auth queries to fetch new user data
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

            showToast('નોંધણી સફળ રહી!', 'success');
            AppLogger.info('User registered successfully');
        },
        onError: (error: any) => {
            showToast(error.message || 'નોંધણીમાં ભૂલ થઈ.', 'error');
            AppLogger.error('Registration failed', error);
        },
    });
};

/**
 * Login user
 * Automatically invalidates auth queries on success
 */
export const useLogin = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (credentials: { phone: string; password: string }) => {
            return await authAPI.login(credentials);
        },
        onSuccess: () => {
            // Invalidate all queries to refresh data for new user
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

            showToast('લોગિન સફળ રહ્યું!', 'success');
            AppLogger.info('User logged in successfully');
        },
        onError: (error: any) => {
            showToast(error.message || 'લોગિનમાં ભૂલ થઈ.', 'error');
            AppLogger.error('Login failed', error);
        },
    });
};

/**
 * Logout user
 * Clears all cached queries
 */
export const useLogout = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async () => {
            authAPI.logout();
        },
        onSuccess: () => {
            // Clear all cached data on logout
            queryClient.clear();

            showToast('લોગઆઉટ સફળ રહ્યું!', 'success');
            AppLogger.info('User logged out successfully');
        },
    });
};
