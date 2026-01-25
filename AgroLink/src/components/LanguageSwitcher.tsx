import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/api/useUsersQuery';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language');
    if (savedLang && ['en', 'hi', 'gu'].includes(savedLang) && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleLanguage = async () => {
    const langs = ['en', 'hi', 'gu'] as const;
    const currentIndex = langs.indexOf(i18n.language as any);
    const nextIndex = (currentIndex + 1) % langs.length;
    const newLang = langs[nextIndex];

    await i18n.changeLanguage(newLang);
    localStorage.setItem('app-language', newLang);

    // Persist to database if authenticated
    if (isAuthenticated && user) {
      const formData = new FormData();
      formData.append('language', newLang);
      updateProfileMutation.mutate(formData);
    }
  };

  const getLabel = (lang: string) => {
    switch (lang) {
      case 'en': return 'EN';
      case 'hi': return 'हिं';
      case 'gu': return 'ગુ';
      default: return 'EN';
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={updateProfileMutation.isPending}
      className={`flex items-center gap-1.5 bg-bg-muted hover:bg-border-base text-text-primary px-3 py-1.5 rounded-md text-xs font-bold font-sans transition-all border border-border-base cursor-pointer min-w-[50px] justify-center ${updateProfileMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
      aria-label="Toggle Language"
    >
      <Globe className="w-3.5 h-3.5 text-brand-primary" />
      <span className="uppercase tracking-wider">{getLabel(i18n.language)}</span>
    </button>
  );
};


export default LanguageSwitcher;

