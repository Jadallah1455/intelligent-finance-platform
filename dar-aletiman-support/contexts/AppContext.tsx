import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Language, Theme } from '../types';
import { translations } from '../translations';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Detect initial language from URL or localStorage or default
  const getInitialLanguage = (): Language => {
    const url = window.location.href;
    if (url.includes('lang=ar')) return 'ar';
    if (url.includes('lang=en')) return 'en';

    const saved = localStorage.getItem('dar_language') as Language;
    if (saved && (saved === 'ar' || saved === 'en')) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'ar';
  };

  // Detect initial theme from URL or default
  const getInitialTheme = (): Theme => {
    const url = window.location.href;
    if (url.includes('theme=dark')) return 'dark';
    if (url.includes('theme=light')) return 'light';
    return 'light';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  // Listen for updates from parent embed script
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'SET_THEME') {
          setTheme(event.data.theme as Theme);
        }
        if (event.data.type === 'SET_LANGUAGE') {
          setLanguage(event.data.language as Language);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // Initial setup & Persistence
    localStorage.setItem('dar_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      toggleTheme,
      t,
      dir: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
