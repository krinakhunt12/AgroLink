import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Phone, Lock, Sprout, Lightbulb, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useLogin } from '../hooks/api';
import { useToast } from '../components/Toast';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GoogleLoginButton } from '../components/Login/GoogleLoginButton';
import { ForgotPasswordModal } from '../components/Login/ForgotPasswordModal';

const Login: React.FC = () => {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const { login, isLoginLoading } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();
  const loginMutation = useLogin();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      showToast(t('errors:login.fillAll'), 'error');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showToast(t('errors:login.invalidPhone'), 'error');
      return;
    }

    try {
      // Use TanStack Query mutation
      await loginMutation.mutateAsync({
        phone: formData.phone,
        password: formData.password
      });

      // Get user info to determine redirect
      const user = authAPI.getCurrentUser();

      // Small delay to show success message
      setTimeout(() => {
        // Redirect based on user type
        const from = (location.state as any)?.from?.pathname;
        if (from && !from.includes('/login') && !from.includes('/register')) {
          navigate(from, { replace: true });
        } else if (user?.userType === 'farmer') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/buyer/dashboard', { replace: true });
        }
      }, 500);
    } catch (error: any) {
      // Error handling is done in the mutation
      // Just log for debugging
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Logo & Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-brand-primary">
            <Sprout size={32} />
            <span className="text-2xl font-bold tracking-tight">{t('common:brand')}</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">{t('auth.loginTitle')}</h1>
          <p className="mt-2 text-text-secondary text-sm">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors">
              {t('auth.registerLink')}
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-bg-surface p-8 rounded-lg shadow-theme border border-border-base">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Phone size={18} />
                  </div>
                  <Input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-secondary">
                    {t('auth.password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Lock size={18} />
                  </div>
                  <Input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 rounded border-border-base text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-text-secondary">
                {t('auth.rememberMe')}
              </label>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-5 px-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-700/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loginMutation.isPending ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={20} /> {t('auth.loginBtn')}</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>{t('common:nav.home')}</span>
          </Link>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};

export default Login;


