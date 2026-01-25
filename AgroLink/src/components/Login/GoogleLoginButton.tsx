import React from 'react';
import { Button } from '../ui/button';
import { useToast } from '../Toast';

interface GoogleLoginButtonProps {
    className?: string;
    text?: string;
    userType?: 'farmer' | 'buyer';
}

/**
 * GoogleLoginButton Component
 * 
 * Note: This component requires Firebase configuration.
 * To enable Google login, add Firebase credentials to your .env file:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_FIREBASE_MEASUREMENT_ID
 */
export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
    className,
    text = "Google સાથે લોગિન",
    userType
}) => {
    const { showToast } = useToast();

    const handleGoogleLogin = async () => {
        showToast("Google login is not configured yet. Please use phone login.", "info");
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-3 py-6 bg-white border-2 border-gray-200 text-gray-700 text-lg font-bold hover:bg-gray-50 transition-all ${className}`}
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            {text}
        </Button>
    );
};
