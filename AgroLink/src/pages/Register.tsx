
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { UserType } from '../types';
import { User, Phone, MapPin, Lock, CheckCircle, Sprout, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Register: React.FC = () => {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [userType, setUserType] = useState<UserType>(UserType.FARMER);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.password) {
      showToast(t('errors:register.fillAll'), 'error');
      return;
    }

    // Validate name (at least 3 characters)
    if (formData.name.trim().length < 3) {
      showToast(t('errors:register.invalidName'), 'error');
      return;
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      showToast(t('errors:register.invalidPhone'), 'error');
      return;
    }

    // Validate password strength (at least 6 characters)
    if (formData.password.length < 6) {
      showToast(t('errors:register.passwordShort'), 'error');
      return;
    }

    // Validate location for farmers
    if (userType === UserType.FARMER && !formData.location) {
      showToast(t('errors:register.locationRequired'), 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name.trim(),
        phone: formData.phone,
        password: formData.password,
        userType: userType,
        location: formData.location || t('errors:register.defaultLocation')
      });

      // Check if registration was successful
      if (response.success && response.token) {
        showToast(t('errors:register.success'), 'success');

        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        throw new Error(t('errors:register.invalidResponse'));
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle specific error messages
      let errorMessage = t('errors:register.failed');

      if (error.message.includes('Phone number already registered')) {
        errorMessage = t('errors:register.alreadyRegistered');
      } else if (error.message.includes('validation')) {
        errorMessage = t('errors:register.validationError');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = t('errors:register.networkError');
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base md:flex md:items-center md:justify-center p-0 md:p-8 font-sans relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-96 h-96 bg-status-warning/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>

      {/* Standalone Back Button */}
      <Link to="/" className="absolute top-8 left-8 z-30 flex items-center gap-2 text-brand-primary font-black hover:text-brand-primary-dark transition-all bg-bg-surface/90 backdrop-blur px-5 py-2.5 rounded-full shadow-theme border border-border-subtle group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>{t('nav.home')}</span>
      </Link>

      <div className="max-w-6xl w-full bg-bg-surface md:rounded-[40px] md:shadow-theme-lg overflow-hidden flex flex-col md:flex-row relative z-10 md:border md:border-border-subtle h-full md:h-auto">
        {/* Info Column */}
        <div className="bg-gradient-to-br from-brand-primary-dark via-brand-primary to-emerald-950 text-white md:w-5/12 p-10 md:p-16 flex flex-col justify-between relative min-h-[400px] md:min-h-0">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-4 mb-14 group w-fit bg-white/10 p-4 rounded-[24px] backdrop-blur-md border border-white/10">
              <Sprout className="w-8 h-8 text-status-warning group-hover:rotate-12 transition-transform" />
              <span className="text-3xl font-black tracking-tighter">{t('common:brand')}</span>
            </Link>

            <h2 className="text-4xl md:text-5xl font-black mb-12 leading-tight tracking-tight">{t('registerInfo.title')}</h2>

            <ul className="space-y-8">
              {(t('registerInfo.list', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-5 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="bg-status-warning p-1.5 rounded-full mt-1 shrink-0 shadow-lg shadow-status-warning/30">
                    <CheckCircle size={16} className="text-brand-primary-dark" />
                  </div>
                  <span className="text-xl font-bold opacity-90 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-16 flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <ShieldCheck className="text-status-warning w-7 h-7" />
            <p className="text-xs font-black uppercase tracking-[0.1em] text-white/80">{t('auth:auth.dataSecurity')}</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:w-7/12 p-8 md:p-16 bg-bg-surface overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-5xl font-black text-text-primary tracking-tight leading-tight">{t('auth.registerTitle')}</h2>
              <p className="mt-4 text-text-secondary font-bold text-lg">{userType === UserType.FARMER ? t('auth.farmerDesc') : t('auth.buyerDesc')}</p>
            </div>

            <div className="flex bg-bg-muted/50 p-1.5 rounded-[24px] mb-12 border border-border-subtle/30 shadow-inner">
              <button
                onClick={() => setUserType(UserType.FARMER)}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-[20px] transition-all ${userType === UserType.FARMER ? 'bg-bg-surface text-brand-primary shadow-theme-lg' : 'text-text-muted hover:text-text-primary'}`}
              >
                {t('auth.farmer')}
              </button>
              <button
                onClick={() => setUserType(UserType.BUYER)}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-[20px] transition-all ${userType === UserType.BUYER ? 'bg-bg-surface text-brand-primary shadow-theme-lg' : 'text-text-muted hover:text-text-primary'}`}
              >
                {t('auth.buyer')}
              </button>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2.5 ml-2 group-focus-within:text-brand-primary">{t('auth.fullName')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-primary transition-colors z-10"><User size={20} /></div>
                    <Input name="name" type="text" required value={formData.name} onChange={handleChange} className="pl-14 py-8 bg-bg-muted/30 border-2 border-border-subtle rounded-[20px] font-black text-lg focus:bg-bg-surface transition-all placeholder:text-text-muted/50" placeholder={userType === UserType.FARMER ? t('auth:auth.placeholderName') : t('auth:auth.placeholderBuyer')} />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2.5 ml-2 group-focus-within:text-brand-primary">{t('auth.phone')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-primary transition-colors z-10"><Phone size={20} /></div>
                    <Input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="pl-14 py-8 bg-bg-muted/30 border-2 border-border-subtle rounded-[20px] font-black text-lg focus:bg-bg-surface transition-all placeholder:text-text-muted/50" placeholder="9876543210" />
                  </div>
                </div>

                {userType === UserType.FARMER && (
                  <div className="group animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2.5 ml-2 group-focus-within:text-brand-primary">{t('auth.village')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-primary transition-colors z-10"><MapPin size={20} /></div>
                      <Input name="location" type="text" required value={formData.location} onChange={handleChange} className="pl-14 py-8 bg-bg-muted/30 border-2 border-border-subtle rounded-[20px] font-black text-lg focus:bg-bg-surface transition-all placeholder:text-text-muted/50" placeholder={t('auth:auth.placeholderVillage')} />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2.5 ml-2 group-focus-within:text-brand-primary">{t('auth.password')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-primary transition-colors z-10"><Lock size={20} /></div>
                    <Input name="password" type="password" required value={formData.password} onChange={handleChange} className="pl-14 py-8 bg-bg-muted/30 border-2 border-border-subtle rounded-[20px] font-black text-lg focus:bg-bg-surface transition-all placeholder:text-text-muted/50" placeholder="********" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="w-full h-auto py-7 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-[20px] font-black text-2xl shadow-xl shadow-brand-primary/20 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                {t('auth.registerBtn')}
              </Button>

              <div className="text-center pt-2">
                <p className="text-text-muted font-bold text-base">
                  {t('auth.haveAccount')}{' '}
                  <Link to="/login" className="text-brand-primary font-black hover:underline underline-offset-8 decoration-2">{t('auth.loginLink')}</Link>
                </p>
              </div>

              <div className="text-center text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] leading-relaxed pt-10 border-t border-border-subtle/30">
                {t('auth.agree', { terms: t('auth.terms') })}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
