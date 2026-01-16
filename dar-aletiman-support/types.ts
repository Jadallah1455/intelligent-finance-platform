export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  frequency: number;
  date: string;
}

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}
