import React from 'react';
import { Phone, Mail, MapPin, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-bg-surface border-t border-border-base py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-brand-primary" />
              <span className="font-bold text-xl text-text-primary tracking-tight">{t('common.brand')}</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">{t('footer.linksTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-text-muted hover:text-brand-primary transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/terms" className="text-text-muted hover:text-brand-primary transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="text-text-muted hover:text-brand-primary transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/help#safety" className="text-text-muted hover:text-brand-primary transition-colors">{t('footer.security')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">{t('footer.supportTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/help#faq" className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer">{t('footer.faq')}</Link></li>
              <li><Link to="/market" className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer">{t('products:market.title')}</Link></li>
              <li><Link to="/ai-advisor" className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer">{t('ai:ai.title')}</Link></li>
              <li><Link to="/news" className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer">{t('common:common.newsTitle')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">{t('footer.contactTitle')}</h3>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-primary" />
                <span>{t('common.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-primary" />
                <span>{t('common.email')}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-primary mt-0.5" />
                <span>{t('common.address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-text-muted uppercase tracking-widest">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

