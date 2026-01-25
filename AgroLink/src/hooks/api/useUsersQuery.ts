import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { useToast } from '../../components/Toast';
import AppLogger from '../../utils/logger';

/**
 * Users Query Hooks
 * 
 * All read operations use useQuery
 * All write operations use useMutation with automatic invalidation
 */

// ============= QUERIES (Read Operations) =============

/**
 * Fetch user profile by ID
 */
export const useUserProfile = (userId: string) => {
    return useQuery({
        queryKey: queryKeys.users.profile(userId),
        queryFn: async () => {
            const response = await usersAPI.getProfile(userId);
            return response.data;
        },
        enabled: !!userId,
    });
};

// ============= MUTATIONS (Write Operations) =============

/**
 * Update user profile
 * Automatically invalidates user queries on success
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (profileData: FormData) => {
            return await usersAPI.updateProfile(profileData);
        },
        onSuccess: () => {
            // Invalidate all user-related queries
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
            // Also invalidate auth to update current user info
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

            showToast('પ્રોફાઇલ અપડેટ થઈ ગઈ છે!', 'success');
            AppLogger.info('Profile updated successfully');
        },
        onError: (error: any) => {
            showToast(error.message || 'પ્રોફાઇલ અપડેટ કરવામાં ભૂલ થઈ.', 'error');
            AppLogger.error('Failed to update profile', error);
        },
    });
};
