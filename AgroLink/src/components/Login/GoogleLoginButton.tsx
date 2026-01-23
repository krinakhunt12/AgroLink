import React from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseConfig } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { useToast } from '../Toast'; // Assuming Toast.tsx is in src/components/

// Initialize Firebase (if not already initialized globally, strictly speaking single init is better but this works for components)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface GoogleLoginButtonProps {
    className?: string;
    text?: string;
    userType?: 'farmer' | 'buyer';
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ className, text = "Google સાથે લોગિન", userType }) => {
    const { googleLogin, isGoogleLoginLoading } = useAuth();
    const { showToast } = useToast();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            googleLogin({ token, userType });

        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            showToast("Google authentication failed. Please try again.", "error");
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoginLoading}
            isLoading={isGoogleLoginLoading}
            className={`w-full flex items-center justify-center gap-3 py-6 bg-white border-2 border-border-subtle text-text-primary text-lg font-bold hover:bg-bg-muted transition-all ${className}`}
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            {text}
        </Button>
    );
};
