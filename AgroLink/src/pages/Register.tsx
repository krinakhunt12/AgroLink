
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UserType } from '../types';
import { User, Phone, MapPin, Lock, Sprout, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GoogleLoginButton } from '../components/Login/GoogleLoginButton';

const Register: React.FC = () => {
  const { t, i18n } = useTranslation(['auth', 'common', 'errors']);
  const { register, isRegisterLoading } = useAuth();
  const { showToast } = useToast();
  const [userType, setUserType] = useState<UserType>(UserType.FARMER);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.password) {
      showToast(t('errors:register.fillAll'), 'error');
      return;
    }

    if (formData.name.trim().length < 3) {
      showToast(t('errors:register.invalidName'), 'error');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showToast(t('errors:register.invalidPhone'), 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast(t('errors:register.passwordShort'), 'error');
      return;
    }

    if (userType === UserType.FARMER && !formData.location) {
      showToast(t('errors:register.locationRequired'), 'error');
      return;
    }

    register({
      name: formData.name.trim(),
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      userType: userType,
      location: formData.location || t('errors:register.defaultLocation'),
      language: i18n.language
    });
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-brand-primary">
            <Sprout size={32} />
            <span className="text-2xl font-bold tracking-tight">{t('common:brand')}</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">{t('auth.registerTitle')}</h1>
          <p className="mt-2 text-text-secondary text-sm">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primary-dark">
              {t('auth.loginLink')}
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-bg-surface p-8 rounded-lg shadow-theme border border-border-base">
          {/* User Type Switch */}
          <div className="flex bg-bg-muted p-1 rounded-md mb-8">
            <button
              onClick={() => setUserType(UserType.FARMER)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${userType === UserType.FARMER ? 'bg-bg-surface text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            >
              {t('auth.farmer')}
            </button>
            <button
              onClick={() => setUserType(UserType.BUYER)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${userType === UserType.BUYER ? 'bg-bg-surface text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            >
              {t('auth.buyer')}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{t('auth.fullName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <User size={18} />
                  </div>
                  <Input name="name" type="text" required value={formData.name} onChange={handleChange} className="pl-10" placeholder={userType === UserType.FARMER ? t('auth.placeholderName') : t('auth.placeholderBuyer')} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{t('auth.phone')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Phone size={18} />
                  </div>
                  <Input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="pl-10" placeholder={t('auth.placeholderPhone')} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{t('auth.email')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Mail size={18} />
                  </div>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} className="pl-10" placeholder={t('auth.placeholderEmail')} />
                </div>
              </div>

              {userType === UserType.FARMER && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">{t('auth.village')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <MapPin size={18} />
                    </div>
                    <Input name="location" type="text" required value={formData.location} onChange={handleChange} className="pl-10" placeholder={t('auth.placeholderVillage')} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <Lock size={18} />
                  </div>
                  <Input name="password" type="password" required value={formData.password} onChange={handleChange} className="pl-10" placeholder={t('auth.placeholderPassword')} />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isRegisterLoading}
              isLoading={isRegisterLoading}
              className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 rounded-md transition-all shadow-sm cursor-pointer"
            >
              {t('auth.registerBtn')}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-base"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-semibold uppercase tracking-wider">{t('common:common.or')}</span>
              <div className="flex-grow border-t border-border-base"></div>
            </div>

            <GoogleLoginButton userType={userType} />
          </form>

          <p className="mt-8 text-center text-[10px] text-text-muted italic">
            {t('auth.agree', { terms: t('auth.terms') })}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>{t('common:nav.home')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

