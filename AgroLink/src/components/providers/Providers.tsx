import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../../components/ui/sonner';
import { queryClient } from '../../lib/query-client';

interface ProvidersProps {
    children: React.ReactNode;
}

/**
 * Root Providers Component
 * Wraps the application with QueryClient, Toasters, and other global contexts.
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                    style: {
                        borderRadius: '12px',
                    }
                }}
            />
        </QueryClientProvider>
    );
};
