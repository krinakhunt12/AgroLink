import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, Lock, Sprout, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GoogleLoginButton } from '../components/Login/GoogleLoginButton';
import { ForgotPasswordModal } from '../components/Login/ForgotPasswordModal';

const Login: React.FC = () => {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const { login, isLoginLoading } = useAuth();
  const { showToast } = useToast();
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

    login({
      phone: formData.phone,
      password: formData.password
    });
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
              disabled={isLoginLoading}
              isLoading={isLoginLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 rounded-md transition-all shadow-sm"
            >
              {t('auth.loginBtn')}
            </Button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border-base"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-semibold uppercase tracking-wider">
                {t('common:or')}
              </span>
              <div className="flex-grow border-t border-border-base"></div>
            </div>

            <GoogleLoginButton />
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


