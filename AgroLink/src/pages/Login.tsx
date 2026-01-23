
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Phone, Lock, Sprout, Lightbulb, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login: React.FC = () => {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.phone || !formData.password) {
      showToast(t('errors:login.fillAll'), 'error');
      return;
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      showToast(t('errors:login.invalidPhone'), 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        phone: formData.phone,
        password: formData.password
      });

      // Check if login was successful
      if (response.success && response.token && response.user) {
        showToast(t('errors:login.welcome', { name: response.user.name }), 'success');

        // Small delay to show success message before navigation
        setTimeout(() => {
          // Navigate based on user type
          if (response.user.userType === 'farmer') {
            navigate('/dashboard');
          } else {
            navigate('/market');
          }
        }, 500);
      } else {
        throw new Error(t('errors:login.invalidResponse'));
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific error messages
      let errorMessage = t('errors:login.failed');

      if (error.message.includes('Invalid credentials')) {
        errorMessage = t('errors:login.invalidCredentials');
      } else if (error.message.includes('Phone number already registered')) {
        errorMessage = t('errors:login.alreadyRegistered');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = t('errors:login.networkError');
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-status-warning/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Floating Back Button */}
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-brand-primary font-black hover:text-brand-primary-dark transition-all bg-bg-surface/80 backdrop-blur px-5 py-2.5 rounded-full shadow-theme border border-border-subtle group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>{t('nav.home')}</span>
      </Link>

      <div className="max-w-4xl w-full bg-bg-surface rounded-[40px] shadow-theme-lg overflow-hidden flex flex-col md:flex-row-reverse relative z-10 border border-border-subtle">
        {/* Visual Panel */}
        <div className="bg-gradient-to-br from-brand-primary via-brand-primary-dark to-emerald-900 text-text-on-brand md:w-5/12 p-12 flex flex-col justify-between relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12 text-white hover:scale-105 transition-transform w-fit bg-white/10 p-4 rounded-[24px] backdrop-blur-sm border border-white/10">
              <Sprout size={32} className="text-status-warning" />
              <span className="font-black text-2xl tracking-tighter">{t('common:brand')}</span>
            </Link>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-inner">
                <h3 className="flex items-center gap-3 font-black text-xl mb-3">
                  <Lightbulb className="text-status-warning" /> {t('loginInfo.title')}
                </h3>
                <p className="font-medium text-sm leading-relaxed text-white/80">{t('loginInfo.tip')}</p>
              </div>

              <div className="flex items-center gap-3 text-white/50 font-black text-[10px] uppercase tracking-[0.2em] pl-4">
                <ShieldCheck size={16} className="text-status-success" /> 100% {t('products:market.verified')}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">© 2024 AGROLINK</p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:w-7/12 p-8 md:p-16">
          <div className="mb-12">
            <h2 className="text-5xl font-black text-text-primary tracking-tight leading-tight">{t('auth.loginTitle')}</h2>
            <p className="mt-4 text-text-secondary font-bold text-lg">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-black text-brand-primary hover:text-brand-primary-dark underline underline-offset-8 decoration-4">{t('auth.registerLink')}</Link>
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within:text-brand-primary transition-colors">{t('auth.phone')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-primary z-10"><Phone size={20} /></div>
                  <Input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-14 py-8 bg-bg-muted/30 border-2 border-border-subtle rounded-[20px] text-text-primary font-black text-lg focus:bg-bg-surface transition-all placeholder:text-text-muted/50"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within:text-brand-primary transition-colors">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-primary z-10"><Lock size={20} /></div>
                  <Input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-14 py-8 bg-bg-muted/30 border-2 border-border-subtle rounded-[20px] text-text-primary font-black text-lg focus:bg-bg-surface transition-all placeholder:text-text-muted/50"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg text-brand-primary focus:ring-brand-primary border-border-subtle bg-bg-muted" />
                <span className="ml-3 text-sm text-text-muted font-black uppercase tracking-wider group-hover:text-text-primary transition-colors">{t('auth.rememberMe')}</span>
              </label>
              <a href="#" className="text-sm font-black text-brand-primary hover:text-brand-primary-dark uppercase tracking-widest">{t('auth.forgotPassword')}</a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="w-full h-auto py-6 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-[20px] font-black text-xl shadow-xl shadow-brand-primary/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              <LogIn className="mr-3 w-6 h-6" /> {t('auth.loginBtn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
