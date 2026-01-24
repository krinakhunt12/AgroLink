import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, X, Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../hooks/useAuth';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation(['auth', 'common']);
    const { forgotPassword, isForgotPasswordLoading } = useAuth();
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        forgotPassword(email, {
            onSuccess: () => {
                onClose();
                setEmail('');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-bg-surface w-full max-w-md rounded-lg shadow-theme border border-border-base overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            {t('auth.forgotPasswordTitle')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-bg-muted rounded-full transition-colors cursor-pointer"
                        >
                            <X size={20} className="text-text-muted" />
                        </button>
                    </div>

                    <p className="text-text-secondary font-medium mb-8 leading-relaxed">
                        {t('auth.forgotPasswordDesc')}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                                {t('auth.email')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                                    <Mail size={20} />
                                </div>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 py-3 bg-bg-muted/30 border border-border-base rounded-md text-text-primary font-medium focus:bg-bg-surface transition-all placeholder:text-text-muted/50"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isForgotPasswordLoading || !email}
                            className="w-full h-12 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-md font-bold text-sm shadow-sm transition-all cursor-pointer"
                        >
                            {isForgotPasswordLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-5 w-5" />
                            )}
                            {t('auth.sendResetLink')}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

