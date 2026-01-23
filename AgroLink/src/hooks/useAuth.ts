import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { UserType } from '../types';

import { QUERY_KEYS } from '../constants/query-keys';

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { i18n } = useTranslation();

    // Access user from cache or API
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: QUERY_KEYS.AUTH.USER,
        queryFn: async () => {
            if (!authAPI.isAuthenticated()) return null;
            try {
                const res = await authAPI.getMe();
                return res.data;
            } catch (error) {
                // If token is invalid, clear storage
                authAPI.logout();
                return null;
            }
        },
        initialData: authAPI.getCurrentUser(), // Use localStorage as initial data to prevent flash
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Sync language with user preference
    useEffect(() => {
        if (user?.language) {
            i18n.changeLanguage(user.language);
        }
    }, [user, i18n]);

    const isAuthenticated = !!user;

    // Login Mutation
    const loginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data) => {
            showToast('સફળતાપૂર્વક લોગિન થયું!', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

            // Redirect based on role
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

    // Google Login Mutation
    const googleLoginMutation = useMutation({
        mutationFn: authAPI.googleLogin,
        onSuccess: (data) => {
            showToast('Google થી લોગિન સફળ થયું!', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

            // Redirect based on role
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
            showToast(error.message || 'Google લોગિન નિષ્ફળ.', 'error');
        }
    });

    // Register Mutation
    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: (data) => {
            showToast('તમારું એકાઉન્ટ સફળતાપૂર્વક બની ગયું!', 'success');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });

            // Redirect based on role
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

    // Logout
    const logout = () => {
        authAPI.logout();
        queryClient.clear(); // Clear all cache
        showToast('લોગઆઉટ સફળ.', 'info');
        navigate('/login');
    };

    return {
        user,
        isAuthenticated,
        role: user?.userType,
        login: loginMutation.mutate,
        isLoginLoading: loginMutation.isPending,
        googleLogin: googleLoginMutation.mutate,
        isGoogleLoginLoading: googleLoginMutation.isPending,
        register: registerMutation.mutate,
        isRegisterLoading: registerMutation.isPending,
        logout
    };
};
