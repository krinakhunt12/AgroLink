import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language');
    if (savedLang && ['en', 'hi', 'gu'].includes(savedLang) && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'gu'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    const newLang = langs[nextIndex];
    i18n.changeLanguage(newLang);
    localStorage.setItem('app-language', newLang);
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
      className="flex items-center gap-1.5 bg-bg-muted hover:bg-border-base text-text-primary px-3 py-1.5 rounded-md text-xs font-bold font-sans transition-all border border-border-base cursor-pointer min-w-[50px] justify-center"
      aria-label="Toggle Language"
    >
      <Globe className="w-3.5 h-3.5 text-brand-primary" />
      <span className="uppercase tracking-wider">{getLabel(i18n.language)}</span>
    </button>
  );
};


export default LanguageSwitcher;

