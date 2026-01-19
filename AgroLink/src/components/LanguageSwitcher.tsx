
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'gu' ? 'en' : 'gu';
    i18n.changeLanguage(newLang);
    localStorage.setItem('app-language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-white/30"
      aria-label="Toggle Language"
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language === 'gu' ? 'EN' : 'ગુ'}</span>
    </button>
  );
};

export default LanguageSwitcher;
