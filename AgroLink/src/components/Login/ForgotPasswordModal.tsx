import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, X, Send } from 'lucide-react';
import { useToast } from '../Toast';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        // For now, just show a message
        showToast(t('auth.featureComingSoon'), "info");
        onClose();
        setPhone('');
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-border-base overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
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
                                {t('auth.phone')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-bg-muted/50 border border-border-base rounded-lg text-text-primary font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                                    placeholder={t('auth.placeholderPhone')}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!phone}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-lg font-bold text-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                            <Send size={20} />
                            {t('auth.sendResetLink')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
