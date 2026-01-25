import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, Loader2, Save, Sprout } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ResetPassword: React.FC = () => {
    const { t } = useTranslation(['auth', 'common', 'errors']);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { resetPassword, isResetPasswordLoading } = useAuth();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!token || !email) {
            showToast(t('errors:general.resetLinkInvalid'), 'error');
            navigate('/login');
        }
    }, [token, email, navigate, showToast, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            showToast(t('errors:login.fillAll'), 'error');
            return;
        }

        if (formData.password.length < 6) {
            showToast(t('errors:register.passwordShort'), 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showToast(t('errors:register.passwordMismatch'), 'error');
            return;
        }

        resetPassword({
            token,
            email,
            password: formData.password
        });
    };

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative">
            {/* Minimal Back Button */}
            <Link to="/login" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-brand-primary font-bold hover:underline bg-white px-4 py-2 rounded-md shadow-sm border border-border-base cursor-pointer">
                <ArrowLeft size={16} />
                <span>{t('auth.backToLogin')}</span>
            </Link>

            <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-border-base p-8 md:p-12 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-lg mb-4">
                        <Sprout size={24} className="text-brand-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
                        {t('auth.resetPasswordTitle')}
                    </h2>
                    <p className="text-text-muted text-sm font-medium">
                        {t('auth.resetPasswordDesc')}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                                {t('auth.newPassword')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                                    <Lock size={18} />
                                </div>
                                <Input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-12 py-3 bg-bg-muted/30 border border-border-base rounded-md text-text-primary font-medium focus:bg-white transition-all placeholder:text-text-muted/50"
                                    placeholder={t('auth.placeholderPassword')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                                {t('auth.confirmPassword')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                                    <ShieldCheck size={18} />
                                </div>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pl-12 py-3 bg-bg-muted/30 border border-border-base rounded-md text-text-primary font-medium focus:bg-white transition-all placeholder:text-text-muted/50"
                                    placeholder={t('auth.placeholderPassword')}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isResetPasswordLoading}
                        className="w-full h-12 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-md font-bold text-sm shadow-sm transition-all cursor-pointer"
                    >
                        {isResetPasswordLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-5 w-5" />
                        )}
                        {t('auth.updatePassword')}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
