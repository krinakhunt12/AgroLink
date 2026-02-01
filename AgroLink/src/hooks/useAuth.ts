/**
 * useAuth Hook - The Authentication Heart of AgroLink
 * 
 * This hook manages everything related to user identity, login, logout, 
 * and account deletion. It uses TanStack Query (React Query) for 
 * high-performance state management and caching.
 * 
 * DESIGN PATTERN: This follows the 'Custom Hook' pattern to decouple 
 * business logic from UI components, making the code cleaner and easier to test.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { authAPI, usersAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { UserType } from '../types';
import { QUERY_KEYS } from '../constants/query-keys';

export const useAuth = () => {
    // Hooks for navigation, caching, and feedback
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { i18n } = useTranslation();

    /**
     * 1. GET CURRENT USER (Query)
     * Automatically fetches user details if a token exists.
     * Includes 'staleTime' to prevent constant re-fetching.
     */
    const {
        data: user,
        isLoading: isUserLoading,
        isFetched
    } = useQuery({
        queryKey: QUERY_KEYS.AUTH.USER,
        queryFn: async () => {
            // Check if user is even logged in before calling API
            if (!authAPI.isAuthenticated()) return null;

            try {
                const res = await authAPI.getMe();
                return res.data;
            } catch (error) {
                // If the token is expired or invalid, we safely log them out
                authAPI.logout();
                return null;
            }
        },
        // initialData helps avoid the 'loading flash' by using localStorage data immediately
        initialData: authAPI.getCurrentUser(),
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    });

    /**
     * 2. LANGUAGE SYNCHRONIZATION
     * If the user has a saved language preference, apply it globally.
     */
    useEffect(() => {
        if (user?.language) {
            i18n.changeLanguage(user.language);
        }
    }, [user?.language, i18n]);

    /**
     * 3. LOGIN WORKFLOW (Mutation)
     * Handles traditional username/password log-in.
     */
    const loginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data) => {
            showToast('સફળતાપૂર્વક લોગિન થયું!', 'success');
            // Invalidate cache so the new user data is fetched
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

            // SMART REDIRECT: Send user to their specific dashboard based on their role
            const userRole = data.user.userType;
            if (userRole === UserType.FARMER) {
                navigate('/farmer/dashboard');
            } else if (userRole === UserType.BUYER) {
                navigate('/buyer/dashboard');
            } else {
                navigate('/');
            }
        },
        onError: (error: any) => {
            showToast(error.message || 'લોગિન નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.', 'error');
        }
    });

    /**
     * 4. LOGOUT WORKFLOW
     * Clears all sensitive data and resets the application state.
     */
    const logout = () => {
        // Clear tokens from LocalStorage
        authAPI.logout();
        // Clear React Query cache so no private data remains in memory
        queryClient.clear();
        showToast('લોગઆઉટ સફળ.', 'info');
        // Back to login page
        navigate('/login');
    };

    /**
     * 5. REGISTER WORKFLOW (Mutation)
     * Creates a new account and logs the user in automatically.
     */
    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: (data) => {
            showToast('તમારું એકાઉન્ટ સફળતાપૂર્વક બની ગયું!', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

            const userRole = data.user.userType;
            if (userRole === UserType.FARMER) {
                navigate('/farmer/dashboard');
            } else if (userRole === UserType.BUYER) {
                navigate('/buyer/dashboard');
            } else {
                navigate('/');
            }
        },
        onError: (error: any) => {
            showToast(error.message || 'રજીસ્ટ્રેશન નિષ્ફળ.', 'error');
        }
    });

    /**
     * 6. REFRESH USER DATA
     * Manually refresh user data from server (useful after verification)
     */
    const refreshUser = async () => {
        const updatedUser = await authAPI.refreshUser();
        if (updatedUser) {
            queryClient.setQueryData(QUERY_KEYS.AUTH.USER, updatedUser);
        }
        return updatedUser;
    };

    /**
     * 7. DELETE ACCOUNT WORKFLOW (Mutation)
     * Permanently withdraws a user from the platform after multi-step confirmation.
     */
    const deleteAccountMutation = useMutation({
        mutationFn: usersAPI.deleteAccount,
        onSuccess: () => {
            showToast('તમારું એકાઉન્ટ સફળતાપૂર્વક ડિલીટ થઈ ગયું છે.', 'success');
            // Immediate cleanup
            authAPI.logout();
            queryClient.clear();
            navigate('/login');
        },
        onError: (error: any) => {
            // This error usually happens if there are active trades
            showToast(error.message || 'એકાઉન્ટ ડિલીટ કરવામાં ભૂલ થઈ.', 'error');
        }
    });

    // Final API return object for components to use
    return {
        // User State
        user,
        isAuthenticated: !!user,
        isUserLoading,
        isFetched,
        role: user?.userType,

        // Auth Functions (Mutations)
        login: loginMutation.mutate,
        isLoginLoading: loginMutation.isPending,

        logout,

        refreshUser, // New: Manual user data refresh

        register: registerMutation.mutate,
        isRegisterLoading: registerMutation.isPending,

        deleteAccount: deleteAccountMutation.mutate,
        isDeletingAccount: deleteAccountMutation.isPending,

        // Helpers for UI feedback
        loginError: loginMutation.error,
        registerError: registerMutation.error
    };
};
