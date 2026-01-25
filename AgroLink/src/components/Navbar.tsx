import React, { useState } from 'react';
import { Menu, X, Sprout, ArrowRight } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '../components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '../components/ui/drawer';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white border-b border-border-base sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 mr-8">
              <Sprout className="h-7 w-7 text-brand-primary" />
              <span className="font-bold text-xl text-text-primary tracking-tight">{t('common.brand')}</span>
            </NavLink>
            <div className="hidden md:ml-6 md:flex md:space-x-4 h-full items-center">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-colors border-b-2 h-full flex items-center ${isActive
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-base'
                    }`
                  }
                >
                  {t(item.translationKey)}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <div className="h-6 w-px bg-border-base mx-2"></div>
            {isAuthenticated ? (
              <Button asChild className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded-md shadow-sm h-9 px-4 cursor-pointer">
                <Link to={user?.userType === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}>
                  {t('nav.dashboard')}
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="text-text-secondary hover:text-text-primary font-semibold text-sm cursor-pointer">
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded-md shadow-sm h-9 px-4 cursor-pointer">
                  <Link to="/register" className="flex items-center gap-2">
                    {t('nav.signup')} <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden gap-3">
            <LanguageSwitcher />
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-text-secondary cursor-pointer">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-white border-t p-4 pb-8 h-[80vh]">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-xl text-text-primary">{t('common.brand')}</span>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="cursor-pointer"><X size={24} /></Button>
                  </DrawerClose>
                </div>
                <div className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-md text-base font-bold flex items-center transition-colors cursor-pointer ${isActive
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-text-secondary hover:bg-bg-muted'
                        }`
                      }
                    >
                      {t(item.translationKey)}
                    </NavLink>
                  ))}
                  <div className="pt-4 border-t border-border-base mt-4 space-y-3">
                    <Button asChild variant="outline" className="w-full h-12 rounded-md font-bold text-text-primary border-border-base cursor-pointer">
                      <Link to="/login" onClick={() => setIsOpen(false)}>{t('nav.login')}</Link>
                    </Button>
                    <Button asChild className="w-full h-12 rounded-md font-bold bg-brand-primary text-white cursor-pointer">
                      <Link to="/register" onClick={() => setIsOpen(false)}>{t('nav.signup')}</Link>
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;