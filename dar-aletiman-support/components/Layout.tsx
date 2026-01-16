import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Sun, Moon, Globe, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatWidget from './ChatWidget';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, language, setLanguage, t, dir } = useApp();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-brand-800 dark:text-brand-50 leading-tight">
                  {t('logo.name')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 tracking-wide">
                  {t('logo.slogan')}
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-brand-700 ${isActive('/') ? 'text-brand-700 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/chat"
                className={`text-sm font-medium transition-colors hover:text-brand-700 ${isActive('/chat') ? 'text-brand-700 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {t('nav.chat')}
              </Link>
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-brand-700 ${isActive('/admin') ? 'text-brand-700 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {t('nav.admin')}
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2"
              >
                <Globe size={18} />
                <span className="text-xs font-bold">{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-700 dark:text-brand-400 transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-400/10 blur-[100px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-slate-400/5 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="hover:text-brand-500 cursor-pointer">{t('footer.privacy')}</span>
            <span className="hover:text-brand-500 cursor-pointer">{t('footer.terms')}</span>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Layout;