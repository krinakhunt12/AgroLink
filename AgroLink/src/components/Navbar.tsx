
import React, { useState } from 'react';
import { Menu, X, Sprout } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '../components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '../components/ui/drawer';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-brand-primary-dark text-text-on-brand shadow-theme sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-white rounded-full p-1.5 group-hover:rotate-12 transition-transform duration-300">
                <Sprout className="h-6 w-6 text-brand-primary-dark" />
              </div>
              <span className="font-bold text-xl tracking-wider group-hover:text-brand-primary-light transition-colors">{t('common.brand')}</span>
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-baseline space-x-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive
                      ? 'bg-bg-surface text-brand-primary-dark shadow-theme transform scale-105'
                      : 'text-text-on-brand/90 hover:bg-brand-primary/50 hover:text-text-on-brand'
                    }`
                  }
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {t(item.translationKey)}
                </NavLink>
              ))}
            </div>
            <div className="ml-4 pl-4 border-l border-brand-primary/50">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="-mr-2 flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-on-brand hover:bg-brand-primary"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-brand-primary-dark border-brand-primary px-4 pb-8">
                <div className="flex justify-between items-center py-6 mb-4 border-b border-brand-primary/30">
                  <span className="font-bold text-xl text-text-on-brand">{t('common.brand')}</span>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="text-text-on-brand"><X size={24} /></Button>
                  </DrawerClose>
                </div>
                <div className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-4 rounded-xl text-lg font-bold flex items-center gap-4 transition-all ${isActive
                          ? 'bg-bg-surface text-brand-primary-dark shadow-lg translate-x-2'
                          : 'text-text-on-brand/90 hover:bg-brand-primary/50'
                        }`
                      }
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      {t(item.translationKey)}
                    </NavLink>
                  ))}
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
