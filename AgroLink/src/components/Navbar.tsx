
import React, { useState } from 'react';
import { Menu, X, Sprout } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-800 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-white rounded-full p-1.5 group-hover:rotate-12 transition-transform duration-300">
                 <Sprout className="h-6 w-6 text-green-700" />
              </div>
              <span className="font-bold text-xl tracking-wider group-hover:text-yellow-300 transition-colors">ખેડૂત સેતુ</span>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-baseline space-x-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-green-800 shadow-md transform scale-105'
                        : 'text-green-50 hover:bg-green-600/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {t(item.translationKey)}
                </NavLink>
              ))}
            </div>
            <div className="ml-4 pl-4 border-l border-green-600/50">
               <LanguageSwitcher />
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-100 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-green-800 border-t border-green-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${
                    isActive
                      ? 'bg-green-900 text-white border-l-4 border-yellow-400'
                      : 'text-green-100 hover:bg-green-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {t(item.translationKey)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
