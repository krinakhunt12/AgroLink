import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import AppLogger, { LogCategory } from '../../utils/logger';

/**
 * Demo Mutation Hook
 * Demonstrates the principle of handling API feedback and logging 
 * exclusively within the hook layer.
 */
export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            // Simulate API call
            AppLogger.info(LogCategory.API, 'Attempting user registration', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate random failure for demo
            if (Math.random() > 0.8) {
                throw new Error('Registration failed: Email already in use');
            }

            return { success: true, email: data.email };
        },
        onSuccess: (data) => {
            // API success handling in hook
            toast.success('Account created successfully! Welcome to AgroLink.');
            AppLogger.success(LogCategory.AUTH, `User registered: ${data.email}`);
        },
        onError: (error: any) => {
            // API error handling in hook (mapped by status/message)
            const message = error.message || 'Registration failed';
            toast.error(message);
            AppLogger.apiError('POST', '/register', error);
        }
    });
};
