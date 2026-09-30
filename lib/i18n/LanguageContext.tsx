'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { LanguageCode } from '@/types';

type TranslationType = typeof translations['en'];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationType;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('agrovista_lang') as LanguageCode;
    if (saved === 'en' || saved === 'te') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('agrovista_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'te' : 'en';
    setLanguage(next);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
