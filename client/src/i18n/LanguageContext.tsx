import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { 
  Language, 
  defaultLanguage, 
  getTranslations, 
  detectBrowserLanguage,
  getLanguageFromPath,
  getPathWithLanguage,
  translations
} from './index';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = 'preferred_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [language, setLanguageState] = useState<Language>(() => {
    const pathLang = getLanguageFromPath(location);
    if (pathLang !== defaultLanguage) return pathLang;
    
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && ['en', 'es', 'fr', 'de'].includes(stored)) {
        return stored as Language;
      }
    }
    
    return detectBrowserLanguage();
  });

  useEffect(() => {
    const pathLang = getLanguageFromPath(location);
    if (pathLang !== language) {
      setLanguageState(pathLang);
    }
  }, [location]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const hasVisited = localStorage.getItem('has_visited');
      if (!hasVisited) {
        localStorage.setItem('has_visited', 'true');
        const detected = detectBrowserLanguage();
        if (detected !== defaultLanguage && getLanguageFromPath(location) === defaultLanguage) {
          const newPath = getPathWithLanguage(location, detected);
          setLocation(newPath);
        }
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newPath = getPathWithLanguage(location, lang);
    setLocation(newPath);
  };

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
